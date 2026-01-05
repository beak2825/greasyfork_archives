// ==UserScript==
// @name         [Katcr.co] Bring Back Cheevos
// @namespace    pxgamer
// @version      1.0.0
// @description  Allows you to get cheevos back on KAT.
// @author       pxgamer
// @include      *katcr.co/community/?achievements*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22323/%5BKatcrco%5D%20Bring%20Back%20Cheevos.user.js
// @updateURL https://update.greasyfork.org/scripts/22323/%5BKatcrco%5D%20Bring%20Back%20Cheevos.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    const cheevos = [
        {
            "title":    "2011: Xmas",
            "type":     "special",
            "desc":     "Merry Christmas!",
            "achieved": "false"
        },
        {
            "title":    "2012: Santa Claus",
            "type":     "special",
            "desc":     "Landed on KAT on the New Years Eve!",
            "achieved": "false"
        },
        {
            "title":    "2011: Last Man Uploading",
            "type":     "special",
            "desc":     "Last 2011 Upload.",
            "achieved": "false"
        },
        {
            "title":    "2012: First Man Uploading",
            "type":     "special",
            "desc":     "First 2012 Upload.",
            "achieved": "false"
        },
        {
            "title":    "Knee-arrow",
            "type":     "special",
            "desc":     "Took an Arrow in the Knee.",
            "achieved": "false"
        },
        {
            "title":    "2012: Saint Katrick",
            "type":     "special",
            "desc":     "Visited KAT on Saint Patricks Day 2012.",
            "achieved": "false"
        },
        {
            "title":    "2012: Fooled",
            "type":     "special",
            "desc":     "Got fooled on KAT on Aprils Fools Day 2012.",
            "achieved": "false"
        },
        {
            "title":    "Five points to Gryffindor",
            "type":     "special",
            "desc":     "You're a wizard, Harry!",
            "achieved": "false"
        },
        {
            "title":    "Heir of Slytherin",
            "type":     "special",
            "desc":     "Chamber of Secrets has been opened.",
            "achieved": "false"
        },
        {
            "title":    "Azkaban Escape",
            "type":     "special",
            "desc":     "Beware of Dementor's Kiss.",
            "achieved": "false"
        },
        {
            "title":    "Triwizard Champion",
            "type":     "special",
            "desc":     "The Triwizard Tournament has begun.",
            "achieved": "false"
        },
        {
            "title":    "Joined Dumbledore's Army",
            "type":     "special",
            "desc":     "The Dark Lord has Returned.",
            "achieved": "false"
        },
        {
            "title":    "Felix Felitis",
            "type":     "special",
            "desc":     "It's liquid luck!",
            "achieved": "false"
        },
        {
            "title":    "Master of Death",
            "type":     "special",
            "desc":     "Possessor of The Legendary Deathly Hallows.",
            "achieved": "false"
        },
        {
            "title":    "Sparkling Vampire!",
            "type":     "special",
            "desc":     "His girlfriend made him do it!",
            "achieved": "false"
        },
        {
            "title":    "Fellowship Member",
            "type":     "special",
            "desc":     "One does not simply get this achievement.",
            "achieved": "false"
        },
        {
            "title":    "Jedi Knight",
            "type":     "special",
            "desc":     "A passion for the Force has he!",
            "achieved": "false"
        },
        {
            "title":    "2012: Torrents Day",
            "type":     "special",
            "desc":     "Happy Torrents Day! For being online on this Special Day of the 30th March.",
            "achieved": "false"
        },
        {
            "title":    "2012: Halloween",
            "type":     "special",
            "desc":     "Seeders and Leechers of every age!",
            "achieved": "false"
        },
        {
            "title":    "2012: Xmas",
            "type":     "special",
            "desc":     "Merry Christmas 2012!",
            "achieved": "false"
        },
        {
            "title":    "2013: Santa Claus",
            "type":     "special",
            "desc":     "Landed on KAT on the New Years Eve!",
            "achieved": "false"
        },
        {
            "title":    "Die Sharing",
            "type":     "special",
            "desc":     "Seed till the world's end!",
            "achieved": "false"
        },
        {
            "title":    "2013: Saint Katrick",
            "type":     "special",
            "desc":     "Visited KAT on Saint Patricks Day 2013.",
            "achieved": "false"
        },
        {
            "title":    "2013: Fooled",
            "type":     "special",
            "desc":     "Got fooled on KAT on Aprils Fools Day 2013.",
            "achieved": "false"
        },
        {
            "title":    "2013: Torrents Day",
            "type":     "special",
            "desc":     "Happy Torrents Day! For being online on this Special Day of the 30th March.",
            "achieved": "false"
        },
        {
            "title":    "Survived Nicolas Cage Week",
            "type":     "special",
            "desc":     "Has been caged, but is now free!",
            "achieved": "false"
        },
        {
            "title":    "The AfT3RLiF3 Eternity Award",
            "type":     "special",
            "desc":     "Fallen Hero's and Great Retired Members.",
            "achieved": "false"
        },
        {
            "title":    "Ultra Art 2013",
            "type":     "special",
            "desc":     "Users who proudly created their own KAT shirt.",
            "achieved": "false"
        },
        {
            "title":    "KAT's Questioner",
            "type":     "special",
            "desc":     "Different question every day for a full year!",
            "achieved": "false"
        },
        {
            "title":    "Captain",
            "type":     "special",
            "desc":     "Steady as she goes, matey!",
            "achieved": "false"
        },
        {
            "title":    "Tutorial Writer",
            "type":     "special",
            "desc":     "Those who share knowledge!",
            "achieved": "false"
        },
        {
            "title":    "Moderator of the Year 2012",
            "type":     "special",
            "desc":     "Voted by KAT community for the Service and help provided and the dedication to the site!",
            "achieved": "false"
        },
        {
            "title":    "Staff of the Year 2012",
            "type":     "special",
            "desc":     "Voted by KAT community for the Service and help provided and the dedication to the site!",
            "achieved": "false"
        },
        {
            "title":    "Kat Official Drama Queen",
            "type":     "special",
            "desc":     "Always In The Middle Of It!",
            "achieved": "false"
        },
        {
            "title":    "Bughunter",
            "type":     "special",
            "desc":     "Helped in eliminating a bug on KAT.",
            "achieved": "false"
        },
        {
            "title":    "Mobile Moderator",
            "type":     "special",
            "desc":     "For being online whether on computer or on mobile phone.",
            "achieved": "false"
        },
        {
            "title":    "Official Kat Troll",
            "type":     "special",
            "desc":     "Trolling Like a Big Shot.",
            "achieved": "false"
        },
        {
            "title":    "KAT Mom",
            "type":     "special",
            "desc":     "Everyone needs a mom!",
            "achieved": "false"
        },
        {
            "title":    "Kickass IRC Operator",
            "type":     "special",
            "desc":     "Chatting, helping, having fun.",
            "achieved": "false"
        },
        {
            "title":    "Love at first site",
            "type":     "special",
            "desc":     "It's a love thing.",
            "achieved": "false"
        },
        {
            "title":    "Most Reported Mod",
            "type":     "special",
            "desc":     "The name speaks for itself.",
            "achieved": "false"
        },
        {
            "title":    "Kickass Translator",
            "type":     "special",
            "desc":     "The name speaks for itself.",
            "achieved": "false"
        },
        {
            "title":    "2013: Halloween",
            "type":     "special",
            "desc":     "Seeders and Leechers of every age!",
            "achieved": "false"
        },
        {
            "title":    "2013: Guy Fawkes",
            "type":     "special",
            "desc":     "For being online on Guy Fawkes Night 5th November 2013",
            "achieved": "false"
        },
        {
            "title":    "Diva of Design",
            "type":     "special",
            "desc":     "Professional signature designer!",
            "achieved": "false"
        },
        {
            "title":    "KAT Theme Song",
            "type":     "special",
            "desc":     "Surprise !! ",
            "achieved": "false"
        },
        {
            "title":    "Mr. Durden",
            "type":     "special",
            "desc":     "The first rule of Fight Club is: you do not talk about Fight Club.",
            "achieved": "false"
        },
        {
            "title":    "Survived another KAT update",
            "type":     "special",
            "desc":     "404 achievement not found!",
            "achieved": "false"
        },
        {
            "title":    "2013: Xmas",
            "type":     "special",
            "desc":     "Merry Christmas!",
            "achieved": "false"
        },
        {
            "title":    "2014: Santa Claus",
            "type":     "special",
            "desc":     "Landed on KAT on the New Years Eve!",
            "achieved": "false"
        },
        {
            "title":    "2013: Last Man Uploading",
            "type":     "special",
            "desc":     "Uploading right before the new year!",
            "achieved": "false"
        },
        {
            "title":    "2014: First Man Uploading.",
            "type":     "special",
            "desc":     "Opening 2014 with fresh uploads.",
            "achieved": "false"
        },
        {
            "title":    "Staff of the Year 2013",
            "type":     "special",
            "desc":     "Voted by KAT community for the Service and help provided and the dedication to the site!",
            "achieved": "false"
        },
        {
            "title":    "Moderator of the Year 2013",
            "type":     "special",
            "desc":     "Voted by KAT community for the Service and help provided and the dedication to the site!",
            "achieved": "false"
        },
        {
            "title":    "Patient of Doctor Who",
            "type":     "special",
            "desc":     "Downloaded Doctor Who's 50th Anniversary Special",
            "achieved": "false"
        },
        {
            "title":    "Signature Master",
            "type":     "special",
            "desc":     "For the recognition of designing signatures on kickass from the day you got here.",
            "achieved": "false"
        },
        {
            "title":    "Kat's little helper",
            "type":     "special",
            "desc":     "For helping sorting out torrent categories!",
            "achieved": "false"
        },
        {
            "title":    "Faker Blitz Survivor",
            "type":     "special",
            "desc":     "For all Moderators that survived the faker blitz of 2013/14",
            "achieved": "false"
        },
        {
            "title":    "2014: Torrents Day",
            "type":     "special",
            "desc":     "Happy Torrents Day! For being online on this Special Day of the 30th March.",
            "achieved": "false"
        },
        {
            "title":    "Such Achievement",
            "type":     "special",
            "desc":     "Such torrent! Much download! Very special!",
            "achieved": "false"
        },
        {
            "title":    "2014: Yarr!",
            "type":     "special",
            "desc":     "Visited KAT on International Talk Like a Pirate Day",
            "achieved": "false"
        },
        {
            "title":    "2014: Fooled",
            "type":     "special",
            "desc":     "Got fooled on KAT on April Fools Day 2014.",
            "achieved": "false"
        },
        {
            "title":    "Ride or Die",
            "type":     "special",
            "desc":     "Let's go for a little ride",
            "achieved": "false"
        },
        {
            "title":    "2014: Saint Katrick",
            "type":     "special",
            "desc":     "Visited KAT on Saint Patricks Day 2014.",
            "achieved": "false"
        },
        {
            "title":    "I Dont Tip!",
            "type":     "special",
            "desc":     "I dont tip because society says I have to...",
            "achieved": "false"
        },
        {
            "title":    "Winner of a Competition",
            "type":     "special",
            "desc":     "These users has been participating and won a kickass competition! ",
            "achieved": "false"
        },
        {
            "title":    "The Blue pill",
            "type":     "special",
            "desc":     "Ignorance is bliss",
            "achieved": "false"
        },
        {
            "title":    "The Red pill",
            "type":     "special",
            "desc":     "This is the truth",
            "achieved": "false"
        },
        {
            "title":    "Duck Flocker",
            "type":     "special",
            "desc":     "Joined KAT's Duck Flock",
            "achieved": "false"
        },
        {
            "title":    "KAT Crew GTA V",
            "type":     "special",
            "desc":     "For joining the GTA V Online KAT Crew.",
            "achieved": "false"
        },
        {
            "title":    "Bubatized",
            "type":     "special",
            "desc":     "You have been Bubatized and now your dreams will become Nightmares !",
            "achieved": "false"
        },
        {
            "title":    "2014: Pumpkinhead",
            "type":     "special",
            "desc":     "Created a torrent for Kat-O-Ween 2014",
            "achieved": "false"
        },
        {
            "title":    "Mod Promotion Day!",
            "type":     "special",
            "desc":     "A member of the KickAss Mod Team on the day there was '7 promotions'!",
            "achieved": "false"
        },
        {
            "title":    "2014: Halloween",
            "type":     "special",
            "desc":     "Seeders and Leechers of every age!",
            "achieved": "false"
        },
        {
            "title":    "2014: Xmas",
            "type":     "special",
            "desc":     "Merry Christmas 2014!",
            "achieved": "false"
        },
        {
            "title":    "2014: Last Man Uploading",
            "type":     "special",
            "desc":     "Uploading right before the new year!",
            "achieved": "false"
        },
        {
            "title":    "2015: First Man Uploading",
            "type":     "special",
            "desc":     "Opening 2015 with fresh uploads.",
            "achieved": "false"
        },
        {
            "title":    "Staff of the Year 2014",
            "type":     "special",
            "desc":     "Staff of the year voted upon by the users and fellow team members!",
            "achieved": "false"
        },
        {
            "title":    "Moderator of the Year 2014",
            "type":     "special",
            "desc":     "Moderator of the year voted upon by the users and fellow team members!",
            "achieved": "false"
        },
        {
            "title":    "Interviewed",
            "type":     "special",
            "desc":     "Watched and survived the assassination!",
            "achieved": "false"
        },
        {
            "title":    "2015: Santa Claus",
            "type":     "special",
            "desc":     "Landed on KAT on New Years Eve!",
            "achieved": "false"
        },
        {
            "title":    "2015: KickAss Upload Day",
            "type":     "special",
            "desc":     "Visited KAT on KickAss Upload Day!",
            "achieved": "false"
        },
        {
            "title":    "2015: KickAss Upload Day Participator!",
            "type":     "special",
            "desc":     "Thanks for Taking Part on this Great Day!",
            "achieved": "false"
        },
        {
            "title":    "2015: Eid al-Adha",
            "type":     "special",
            "desc":     "Happy Eid al-Adha 2015!",
            "achieved": "false"
        },
        {
            "title":    "2015: Eid al-Fitr",
            "type":     "special",
            "desc":     "Happy Eid al-Fitr!",
            "achieved": "false"
        },
        {
            "title":    "2015: Saint Katrick",
            "type":     "special",
            "desc":     "Visited KAT on Saint Patricks Day 2015.",
            "achieved": "false"
        },
        {
            "title":    "2015: Torrents Day",
            "type":     "special",
            "desc":     "Happy Torrents Day! For being online on this Special Day of the 30th March.",
            "achieved": "false"
        },
        {
            "title":    "2015: Red Nose Day",
            "type":     "special",
            "desc":     "For being online on the day to act silly and raise money for charity",
            "achieved": "false"
        },
        {
            "title":    "It's all about Pi!",
            "type":     "special",
            "desc":     "For all the kat geniuses on this day! ",
            "achieved": "false"
        },
        {
            "title":    "Tell A Lie Day!  April 2 2015",
            "type":     "special",
            "desc":     "Those that just cannot help themselves!",
            "achieved": "false"
        },
        {
            "title":    "2015: HTD Music Lover",
            "type":     "special",
            "desc":     "For the music lovers, the serious music lovers",
            "achieved": "false"
        },
        {
            "title":    "The Katalyst Issue #1",
            "type":     "special",
            "desc":     "Downloaded the first ever issue of the Official Kickass Torrents Magazine!",
            "achieved": "false"
        },
        {
            "title":    "Katalyst Crew",
            "type":     "special",
            "desc":     "the stars and the hard workers behind the kickass magazine \"the Katalyst\"",
            "achieved": "false"
        },
        {
            "title":    "2015: Fooled",
            "type":     "special",
            "desc":     "Got fooled on KAT on Aprils Fools Day 2015.",
            "achieved": "false"
        },
        {
            "title":    "2015: Ramadan",
            "type":     "special",
            "desc":     "Ramadan begins! 18 of June 2015 &gt;&gt;&gt; 17 July 2015.",
            "achieved": "false"
        },
        {
            "title":    "HTD Music Man",
            "type":     "special",
            "desc":     "For a phenomenal &amp; dedicated effort in releasing the Happy Torrents Day albums every year!",
            "achieved": "false"
        },
        {
            "title":    "2015: Earth Day",
            "type":     "special",
            "desc":     "Today is a day we can all band together and share our love for this beautiful planet.",
            "achieved": "false"
        },
        {
            "title":    "HTD Famous Inventor",
            "type":     "special",
            "desc":     "For the Great Mr.Black for bringing us the fabulous Happy Torrents Day - 30th March every year!",
            "achieved": "false"
        },
        {
            "title":    "2016: Leap Year",
            "type":     "special",
            "desc":     "For arriving on kickasstorrents on 29th February for a Special Leap Year.",
            "achieved": "false"
        },
        {
            "title":    "2015: International Workers Day",
            "type":     "special",
            "desc":     "For Arriving on Kickass on International Workers Day on 1st May",
            "achieved": "false"
        },
        {
            "title":    "Xenomorphed!",
            "type":     "special",
            "desc":     "Participated in Xenomorph Avatar Week",
            "achieved": "false"
        },
        {
            "title":    "The Katalyst Issue #2",
            "type":     "special",
            "desc":     "Downloaded Issue 2 of everyone's favorite read.",
            "achieved": "false"
        },
        {
            "title":    "A collection of amazing",
            "type":     "special",
            "desc":     "Follow the clues, and you will be awarded this achievement.",
            "achieved": "false"
        },
        {
            "title":    "The Katalyst Issue #3",
            "type":     "special",
            "desc":     "Downloaded Issue #3 of everyone's favorite read.",
            "achieved": "false"
        },
        {
            "title":    "Insanity at it's Finest",
            "type":     "special",
            "desc":     "For being a member of the mod team when all staff &amp; admin lost the plot!",
            "achieved": "false"
        },
        {
            "title":    "You feel lucky?...Punk!",
            "type":     "special",
            "desc":     "You Survived Clint Eastwood Week!",
            "achieved": "false"
        },
        {
            "title":    "2015: Torrent Request Month",
            "type":     "special",
            "desc":     "Logged in on the last day of Torrent Request Month - August 2015",
            "achieved": "false"
        },
        {
            "title":    "No.1 Movie Organiser",
            "type":     "special",
            "desc":     "For the time and effort in organising newly released movies in threads for the community as and when they are released and taking time to do it over so many years.",
            "achieved": "false"
        },
        {
            "title":    "Shazbot",
            "type":     "special",
            "desc":     "You Survived Robin Williams Week!",
            "achieved": "false"
        },
        {
            "title":    "The Naked Super Moderator",
            "type":     "special",
            "desc":     "for Performing their Mod Duties while being Naked!",
            "achieved": "false"
        },
        {
            "title":    "You Idiot",
            "type":     "special",
            "desc":     "It's that Time of Year Again!",
            "achieved": "false"
        },
        {
            "title":    "The Katalyst Issue #4",
            "type":     "special",
            "desc":     "Issue #4 of everyone's favorite read.",
            "achieved": "false"
        },
        {
            "title":    "The Naked Orgasm",
            "type":     "special",
            "desc":     "For Finishing Off one's work while being naked",
            "achieved": "false"
        },
        {
            "title":    "2015: Halloween",
            "type":     "special",
            "desc":     "Seeders and Leechers of every age!",
            "achieved": "false"
        },
        {
            "title":    "Cancer Awareness Month",
            "type":     "special",
            "desc":     "Wear this achievement with pride and make the world aware that getting checked for cancer is important. You could save a life.",
            "achieved": "false"
        },
        {
            "title":    "2015: Last Man Uploading",
            "type":     "special",
            "desc":     "Uploading Just Before the New Year!",
            "achieved": "false"
        },
        {
            "title":    "2016: First Man Uploading",
            "type":     "special",
            "desc":     "Opening 2016 with Fresh Uploads!",
            "achieved": "false"
        },
        {
            "title":    "Staff of the Year 2015",
            "type":     "special",
            "desc":     "Staff of the Year Voted Upon by the Users and Fellow Team Members!",
            "achieved": "false"
        },
        {
            "title":    "Moderator of the Year 2015",
            "type":     "special",
            "desc":     "Moderator of the Year Voted Upon by the Users and Fellow Team Members!",
            "achieved": "false"
        },
        {
            "title":    "2015: Xmas Eve",
            "type":     "special",
            "desc":     "Merry Christmas 2015!",
            "achieved": "false"
        },
        {
            "title":    "2015: New Year's Eve",
            "type":     "special",
            "desc":     "Landed on KAT on New Years Eve!",
            "achieved": "false"
        },
        {
            "title":    "2016: New Year's Day",
            "type":     "special",
            "desc":     "Landed on KAT New Year's Day 2016!",
            "achieved": "false"
        },
        {
            "title":    "2015: Xmas Day",
            "type":     "special",
            "desc":     "Landed on KAT Xmas Day 2015",
            "achieved": "false"
        },
        {
            "title":    "Welcome to the Future",
            "type":     "special",
            "desc":     "For traveling through time and landing on KickassTorrents on October 21st, 2015.",
            "achieved": "false"
        },
        {
            "title":    "2015: Pumpkinhead",
            "type":     "special",
            "desc":     "Created a Torrent for Kat-O-Ween 2015",
            "achieved": "false"
        },
        {
            "title":    "2016: Torrents Day",
            "type":     "special",
            "desc":     "Happy Torrents Day! For being online on this Special Day of the 30th March.",
            "achieved": "false"
        },
        {
            "title":    "Forum Mod of the Year 2015",
            "type":     "special",
            "desc":     "Forum Moderator of the Year Voted Upon by the Users and Fellow Team Members!",
            "achieved": "false"
        },
        {
            "title":    "2015: World Science Day",
            "type":     "special",
            "desc":     "Participated In KAT's World Science Day!",
            "achieved": "false"
        },
        {
            "title":    "The Site Awakens",
            "type":     "special",
            "desc":     "For being online for this memorable moment. ",
            "achieved": "false"
        },
        {
            "title":    "Ashes to Ashes",
            "type":     "special",
            "desc":     "The Man Who Sold The World",
            "achieved": "false"
        },
        {
            "title":    "2016: Saint Katrick",
            "type":     "special",
            "desc":     "Visited KAT on Saint Patricks Day 2016.",
            "achieved": "false"
        },
        {
            "title":    "2016: KAT Remembrance Day",
            "type":     "special",
            "desc":     "KAT Remembrance Day",
            "achieved": "false"
        },
        {
            "title":    "2016: Fooled",
            "type":     "special",
            "desc":     "Got Fooled on KAT Aprils Fools Day 2016",
            "achieved": "false"
        },
        {
            "title":    "2016: HTD Music Lover",
            "type":     "special",
            "desc":     "For the music lovers, the serious music lovers",
            "achieved": "false"
        },
        {
            "title":    "No More Images",
            "type":     "special",
            "desc":     "Visited Kickasstorrents on the day most images disappeared",
            "achieved": "false"
        },
        {
            "title":    "You Sexy MF!",
            "type":     "special",
            "desc":     "Remembering a Legend!",
            "achieved": "false"
        },
        {
            "title":    "Wanna get F'ed up?",
            "type":     "special",
            "desc":     "Whose kitty litter did I just sh!t in?",
            "achieved": "false"
        },
        {
            "title":    "HODOR!",
            "type":     "special",
            "desc":     "For Being Game Of Thrones Addicted!",
            "achieved": "false"
        },
        {
            "title":    "2016: Red Nose Day USA",
            "type":     "special",
            "desc":     "For being online the day the USA are acting silly and raising money for charity.",
            "achieved": "false"
        },
        {
            "title":    "The Scriptwriter",
            "type":     "special",
            "desc":     "Providing Users with Great Scripts",
            "achieved": "false"
        },
        {
            "title":    "Champ!",
            "type":     "special",
            "desc":     "Float Like a Butterfly, Sting Like a Bee",
            "achieved": "false"
        },
        {
            "title":    "Global Rank: 70",
            "type":     "special",
            "desc":     "\"The only torrent index to do so since 2007\"",
            "achieved": "false"
        },
        {
            "title":    "Kickass Mod Trainer",
            "type":     "special",
            "desc":     "For helping to train new moderators as they move in to their new roles.",
            "achieved": "false"
        },
        {
            "title":    "Fat Kat",
            "type":     "special",
            "desc":     "Did you just call me FAT?!",
            "achieved": "false"
        },
        {
            "title":    "Kickass True Fan",
            "type":     "gold",
            "desc":     "Visited Kickasstorrents over 200 times.",
            "achieved": "false"
        },
        {
            "title":    "Comments Machine",
            "type":     "gold",
            "desc":     "Left over 500 comments.",
            "achieved": "false"
        },
        {
            "title":    "Download Junkie",
            "type":     "gold",
            "desc":     "Downloaded over 1000 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Releaser",
            "type":     "gold",
            "desc":     "Uploaded over 1000 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Feedback Star",
            "type":     "gold",
            "desc":     "Left feedback on over 500 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Big Brother",
            "type":     "gold",
            "desc":     "Rated over 500 comments.",
            "achieved": "false"
        },
        {
            "title":    "Quality Expert",
            "type":     "gold",
            "desc":     "Left over 500 Audio/Video ratings on movie torrents.",
            "achieved": "false"
        },
        {
            "title":    "Kickass Daily Dose",
            "type":     "gold",
            "desc":     "Has been visiting kickass each day for a month.",
            "achieved": "false"
        },
        {
            "title":    "Terminator",
            "type":     "gold",
            "desc":     "Mod achievement! Deleted over 1000 users.",
            "achieved": "false"
        },
        {
            "title":    "Punisher",
            "type":     "gold",
            "desc":     "Mod achievement! Banned over 1000 users.",
            "achieved": "false"
        },
        {
            "title":    "Torrent Verifier",
            "type":     "gold",
            "desc":     "Verified over 1000 torrents.",
            "achieved": "false"
        },
        {
            "title":    "User Verifier",
            "type":     "gold",
            "desc":     "Verified over 1000 users.",
            "achieved": "false"
        },
        {
            "title":    "Stop Doing This!",
            "type":     "gold",
            "desc":     "Bookmarked over 500 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Online Exhibitionist",
            "type":     "gold",
            "desc":     "Updated status over 500 times.",
            "achieved": "false"
        },
        {
            "title":    "Search Tycoon",
            "type":     "gold",
            "desc":     "Over 1000 searches.",
            "achieved": "false"
        },
        {
            "title":    "Kickass l33t",
            "type":     "gold",
            "desc":     "Reputation over 10000.",
            "achieved": "false"
        },
        {
            "title":    "Spammer Exterminator",
            "type":     "gold",
            "desc":     "Reported over 1000 users.",
            "achieved": "false"
        },
        {
            "title":    "Kickass Veteran",
            "type":     "gold",
            "desc":     "More than three years with us.",
            "achieved": "false"
        },
        {
            "title":    "Yearling",
            "type":     "gold",
            "desc":     "Active member for a year, earning at least 1k reputation.",
            "achieved": "false"
        },
        {
            "title":    "The Katfather",
            "type":     "gold",
            "desc":     "Reputation over 50000.",
            "achieved": "false"
        },
        {
            "title":    "Old Timer",
            "type":     "gold",
            "desc":     "Active member for two years, earning at least 2k reputation.",
            "achieved": "false"
        },
        {
            "title":    "The Survivor",
            "type":     "gold",
            "desc":     "1k days on KAT.",
            "achieved": "false"
        },
        {
            "title":    "Are You Still Here?",
            "type":     "gold",
            "desc":     "Active member for 3 years, earning at least 3k reputation.",
            "achieved": "false"
        },
        {
            "title":    "This Calls For a Party!",
            "type":     "gold",
            "desc":     "Active member for 4 years, earning at least 4k reputation.",
            "achieved": "false"
        },
        {
            "title":    "Fake Destroyer",
            "type":     "gold",
            "desc":     "Reported over 1000 torrents as fake",
            "achieved": "false"
        },
        {
            "title":    "Through thick and thin",
            "type":     "gold",
            "desc":     "Been with us for a half a decade with rep above 5000!",
            "achieved": "false"
        },
        {
            "title":    "Community Manager",
            "type":     "gold",
            "desc":     "Reported over 100 threads!",
            "achieved": "false"
        },
        {
            "title":    "Gossip Girl",
            "type":     "gold",
            "desc":     "Written 50 blogs!",
            "achieved": "false"
        },
        {
            "title":    "Eureka!",
            "type":     "gold",
            "desc":     "Written 20 ideas",
            "achieved": "false"
        },
        {
            "title":    "Nobody knows",
            "type":     "gold",
            "desc":     "Requested nickname change 20 times!",
            "achieved": "false"
        },
        {
            "title":    "Showoff",
            "type":     "gold",
            "desc":     "Has changed their signature 50 times",
            "achieved": "false"
        },
        {
            "title":    "Librarian",
            "type":     "gold",
            "desc":     "Follows such a great amount of threads that I'm sure they have a spreadsheet somewhere to keep track of all this.",
            "achieved": "false"
        },
        {
            "title":    "Like all the things!",
            "type":     "gold",
            "desc":     "Liked a hundred ideas!",
            "achieved": "false"
        },
        {
            "title":    "Community Expert",
            "type":     "gold",
            "desc":     "Written 100 threads",
            "achieved": "false"
        },
        {
            "title":    "Floor Manager",
            "type":     "gold",
            "desc":     "Moved a lot of threads",
            "achieved": "false"
        },
        {
            "title":    "Gotta catch 'em all!",
            "type":     "gold",
            "desc":     "Collected 150 (+1 for this one) Achievements.",
            "achieved": "false"
        },
        {
            "title":    "Einstein",
            "type":     "gold",
            "desc":     "10 great ideas that have been completed!",
            "achieved": "false"
        },
        {
            "title":    "Censor",
            "type":     "gold",
            "desc":     "Muted over 250 users!",
            "achieved": "false"
        },
        {
            "title":    "Exploiting the bandwidth",
            "type":     "gold",
            "desc":     "Uploaded 100 images.",
            "achieved": "false"
        },
        {
            "title":    "Questionnaire",
            "type":     "gold",
            "desc":     "Asked over 50 questions in the FAQ",
            "achieved": "false"
        },
        {
            "title":    "Request Sensei",
            "type":     "gold",
            "desc":     "Posted 100 approved torrents in the request section.",
            "achieved": "false"
        },
        {
            "title":    "Da Vinci",
            "type":     "gold",
            "desc":     "Gotten 20 ideas accepted in the ideabox",
            "achieved": "false"
        },
        {
            "title":    "Wingman",
            "type":     "gold",
            "desc":     "Has submitted 250 torrents in the request section",
            "achieved": "false"
        },
        {
            "title":    "What have you done?!",
            "type":     "gold",
            "desc":     "Approved and given uploading privileges to 500 users",
            "achieved": "false"
        },
        {
            "title":    "Mission Impossible: 1500",
            "type":     "gold",
            "desc":     "Has 1500 friends",
            "achieved": "false"
        },
        {
            "title":    "Postmaster",
            "type":     "gold",
            "desc":     "All these posts were achieved by helping people. And telling them what time it is in my country.",
            "achieved": "false"
        },
        {
            "title":    "Grand Releaser",
            "type":     "gold",
            "desc":     "Uploaded over 5000 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Upvote Elite",
            "type":     "gold",
            "desc":     "Has 10000 likes on their torrents.",
            "achieved": "false"
        },
        {
            "title":    "Professional Kategorizer",
            "type":     "gold",
            "desc":     "A user holding a Super User rank or higher moving over 10,000 torrents to it's rightful categories.",
            "achieved": "false"
        },
        {
            "title":    "Request Hitman",
            "type":     "gold",
            "desc":     "Reported 1000 Torrent Requests",
            "achieved": "false"
        },
        {
            "title":    "Big Achiever",
            "type":     "gold",
            "desc":     "Gotten 200 achievements",
            "achieved": "false"
        },
        {
            "title":    "The Plagiarist ",
            "type":     "gold",
            "desc":     "Has Submitted 1000 Summaries",
            "achieved": "false"
        },
        {
            "title":    "The Summary Verifier",
            "type":     "gold",
            "desc":     "Has verified 1000 summaries",
            "achieved": "false"
        },
        {
            "title":    "2015: KickAss Upload Day Addict!",
            "type":     "gold",
            "desc":     "For going all the Way on KickAss Upload Day!",
            "achieved": "false"
        },
        {
            "title":    "Top Dog",
            "type":     "gold",
            "desc":     "For the select few that make it to the top of the ladder at KickassTorrents with the status that can take you no further.",
            "achieved": "false"
        },
        {
            "title":    "Spamtastic Reporter",
            "type":     "gold",
            "desc":     "Reported over 1000 comments.",
            "achieved": "false"
        },
        {
            "title":    "Sort Assistant",
            "type":     "gold",
            "desc":     "Helped with the VUL/Elite sort, in pre and post launch stages.",
            "achieved": "false"
        },
        {
            "title":    "Until the End of Days",
            "type":     "gold",
            "desc":     "For being on kickasstorrents for 6 years and gaining over 6000 reputation",
            "achieved": "false"
        },
        {
            "title":    "The 100k club",
            "type":     "gold",
            "desc":     "Reputation over 100,000",
            "achieved": "false"
        },
        {
            "title":    "The Seven Year Itch",
            "type":     "gold",
            "desc":     "For being on kickasstorrents for 7 years and gaining over 7000 reputation",
            "achieved": "false"
        },
        {
            "title":    "Half a million and counting",
            "type":     "gold",
            "desc":     "Reputation over 500,000",
            "achieved": "false"
        },
        {
            "title":    "Devoted Visitor",
            "type":     "silver",
            "desc":     "Visited Kickasstorrents over 50 times.",
            "achieved": "false"
        },
        {
            "title":    "Comments Captain",
            "type":     "silver",
            "desc":     "Left over 100 comments.",
            "achieved": "false"
        },
        {
            "title":    "Download Master",
            "type":     "silver",
            "desc":     "Downloaded over 100 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Uploader",
            "type":     "silver",
            "desc":     "Uploaded over 100 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Feedback Expert",
            "type":     "silver",
            "desc":     "Left feedback on over 100 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Mind Police",
            "type":     "silver",
            "desc":     "Rated over 100 comments.",
            "achieved": "false"
        },
        {
            "title":    "Quality Analyst",
            "type":     "silver",
            "desc":     "Left over 100 Audio/Video ratings on movie torrents.",
            "achieved": "false"
        },
        {
            "title":    "Enthusiast",
            "type":     "silver",
            "desc":     "Has been visiting kickass each day for a week.",
            "achieved": "false"
        },
        {
            "title":    "Eraser",
            "type":     "silver",
            "desc":     "Mod achievement! Deleted over 1000 comments.",
            "achieved": "false"
        },
        {
            "title":    "Gatekeeper",
            "type":     "silver",
            "desc":     "Mod achievement! Deleted over 1000 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Voice Keeper",
            "type":     "silver",
            "desc":     "Mod achievement! Restored over 100 comments.",
            "achieved": "false"
        },
        {
            "title":    "Zombie Riser",
            "type":     "silver",
            "desc":     "Mod achievement! Restored over 100 users.",
            "achieved": "false"
        },
        {
            "title":    "Archivarius",
            "type":     "silver",
            "desc":     "Bookmarked over 100 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Twitter Victim",
            "type":     "silver",
            "desc":     "Updated status over 100 times.",
            "achieved": "false"
        },
        {
            "title":    "Torrent Crawler",
            "type":     "silver",
            "desc":     "Over 100 searches.",
            "achieved": "false"
        },
        {
            "title":    "Kickass Fellow",
            "type":     "silver",
            "desc":     "Reputation over 1000.",
            "achieved": "false"
        },
        {
            "title":    "Spammer Buster",
            "type":     "silver",
            "desc":     "Reported over 100 users.",
            "achieved": "false"
        },
        {
            "title":    "Fake Killer",
            "type":     "silver",
            "desc":     "Reported over 100 torrents as fake",
            "achieved": "false"
        },
        {
            "title":    "Children of KAT",
            "type":     "silver",
            "desc":     "Super user with over 5000 rep points",
            "achieved": "false"
        },
        {
            "title":    "Community Police",
            "type":     "silver",
            "desc":     "Reported over 50 threads!",
            "achieved": "false"
        },
        {
            "title":    "Welcome to Blogville!",
            "type":     "silver",
            "desc":     "Written 20 blogs!",
            "achieved": "false"
        },
        {
            "title":    "Site Improver",
            "type":     "silver",
            "desc":     "Written your fifth idea",
            "achieved": "false"
        },
        {
            "title":    "Faceless Manipulator",
            "type":     "silver",
            "desc":     "Requested nickname change five times!",
            "achieved": "false"
        },
        {
            "title":    "Unpredictable",
            "type":     "silver",
            "desc":     "Has changed their signature 20 times.",
            "achieved": "false"
        },
        {
            "title":    "Forum Addict",
            "type":     "silver",
            "desc":     "Has some threads bookmarked",
            "achieved": "false"
        },
        {
            "title":    "Shapeshifter",
            "type":     "silver",
            "desc":     "Changed your avatar 100 times",
            "achieved": "false"
        },
        {
            "title":    "I'm diggin' this",
            "type":     "silver",
            "desc":     "Liked 50 ideas",
            "achieved": "false"
        },
        {
            "title":    "Community Maintainer",
            "type":     "silver",
            "desc":     "Written 25 threads",
            "achieved": "false"
        },
        {
            "title":    "Forum Maintainer",
            "type":     "silver",
            "desc":     "Moved a decent amount of threads",
            "achieved": "false"
        },
        {
            "title":    "I'm a genius!",
            "type":     "silver",
            "desc":     "Gotten 5 ideas completed!",
            "achieved": "false"
        },
        {
            "title":    "Silencer",
            "type":     "silver",
            "desc":     "Muted over a hundred users!",
            "achieved": "false"
        },
        {
            "title":    "To be, or not to be",
            "type":     "silver",
            "desc":     "Asked 10 questions in the FAQ",
            "achieved": "false"
        },
        {
            "title":    "Pic-asso",
            "type":     "silver",
            "desc":     "Uploaded 50 images.",
            "achieved": "false"
        },
        {
            "title":    "Visionary",
            "type":     "silver",
            "desc":     "Gotten 10 ideas accepted in ideabox",
            "achieved": "false"
        },
        {
            "title":    "Request Fulfiller",
            "type":     "silver",
            "desc":     "Posted 50 approved torrents in the request section.",
            "achieved": "false"
        },
        {
            "title":    "Minions Everywhere",
            "type":     "silver",
            "desc":     "Approved and given uploading privileges to 200 users",
            "achieved": "false"
        },
        {
            "title":    "Accio Torrentio",
            "type":     "silver",
            "desc":     "Has submitted 100 torrents in the request section",
            "achieved": "false"
        },
        {
            "title":    "Mr.Popular",
            "type":     "silver",
            "desc":     "Has 750 friends",
            "achieved": "false"
        },
        {
            "title":    "Mailman",
            "type":     "silver",
            "desc":     "Taking up server space. Because it's free!",
            "achieved": "false"
        },
        {
            "title":    "Backlog",
            "type":     "silver",
            "desc":     "Over 100 items in your feedback tab. Clean it!",
            "achieved": "false"
        },
        {
            "title":    "Upvote Captain",
            "type":     "silver",
            "desc":     "Has 5000 likes on their torrents.",
            "achieved": "false"
        },
        {
            "title":    "Kategorizer Expert",
            "type":     "silver",
            "desc":     "A user holding a Super User rank or higher moving over 2500 torrents to it's rightful categories.",
            "achieved": "false"
        },
        {
            "title":    "Request Cleaner",
            "type":     "silver",
            "desc":     "Reported 500 Torrent Requests",
            "achieved": "false"
        },
        {
            "title":    "Torrent Reviver",
            "type":     "silver",
            "desc":     "Mod achievement! Restored over 100 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Achiever",
            "type":     "silver",
            "desc":     "Gotten 100 achievements",
            "achieved": "false"
        },
        {
            "title":    "The Summary Cheater",
            "type":     "silver",
            "desc":     "Has Submitted 100 Summaries",
            "achieved": "false"
        },
        {
            "title":    "2015: KickAss Upload Day Silver Shiner",
            "type":     "silver",
            "desc":     "Warmed up nicely with more than a few uploads!",
            "achieved": "false"
        },
        {
            "title":    "Anti-Spam Guard",
            "type":     "silver",
            "desc":     "Reported over 250 comments.",
            "achieved": "false"
        },
        {
            "title":    "KAT Citizen",
            "type":     "silver",
            "desc":     "More than a year with us",
            "achieved": "false"
        },
        {
            "title":    "Rare guest",
            "type":     "bronze",
            "desc":     "Visited Kickasstorrents over 10 times",
            "achieved": "false"
        },
        {
            "title":    "Feedback Pioneer",
            "type":     "bronze",
            "desc":     "Left over 10 comments.",
            "achieved": "false"
        },
        {
            "title":    "Download Rookie",
            "type":     "bronze",
            "desc":     "Downloaded over 10 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Casual Uploader",
            "type":     "bronze",
            "desc":     "Uploaded over 10 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Feedbacker",
            "type":     "bronze",
            "desc":     "Left feedback on over 10 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Comment Voter",
            "type":     "bronze",
            "desc":     "Rated over 10 comments.",
            "achieved": "false"
        },
        {
            "title":    "Movie Inspector",
            "type":     "bronze",
            "desc":     "Left over 10 Audio/Video ratings on movie torrents.",
            "achieved": "false"
        },
        {
            "title":    "Bookmarker",
            "type":     "bronze",
            "desc":     "Bookmarked over 50 torrents.",
            "achieved": "false"
        },
        {
            "title":    "Moodchanger",
            "type":     "bronze",
            "desc":     "Updated status over 10 times.",
            "achieved": "false"
        },
        {
            "title":    "Searcher",
            "type":     "bronze",
            "desc":     "Over 10 searches.",
            "achieved": "false"
        },
        {
            "title":    "Kickass Contributor",
            "type":     "bronze",
            "desc":     "Reputation over 500.",
            "achieved": "false"
        },
        {
            "title":    "Spammer Hunter",
            "type":     "bronze",
            "desc":     "Reported over 10 users.",
            "achieved": "false"
        },
        {
            "title":    "Customizer",
            "type":     "bronze",
            "desc":     "Over 5 custom widgets.",
            "achieved": "false"
        },
        {
            "title":    "First Steps",
            "type":     "bronze",
            "desc":     "Earned all simple achievements.",
            "achieved": "false"
        },
        {
            "title":    "Fake Hunter",
            "type":     "bronze",
            "desc":     "Reported over 10 torrents as fake",
            "achieved": "false"
        },
        {
            "title":    "Community Helper",
            "type":     "bronze",
            "desc":     "Reported over 20 threads!",
            "achieved": "false"
        },
        {
            "title":    "Hello world!",
            "type":     "bronze",
            "desc":     "Created your first blog post!",
            "achieved": "false"
        },
        {
            "title":    "Cold Feet",
            "type":     "bronze",
            "desc":     "Requested a name change twice.",
            "achieved": "false"
        },
        {
            "title":    "Lightbulb",
            "type":     "bronze",
            "desc":     "Written your first idea",
            "achieved": "false"
        },
        {
            "title":    "Refresher",
            "type":     "bronze",
            "desc":     "Has changed their signature 10 times.",
            "achieved": "false"
        },
        {
            "title":    "Face off",
            "type":     "bronze",
            "desc":     "Changed avatar 10 times",
            "achieved": "false"
        },
        {
            "title":    "Collector",
            "type":     "bronze",
            "desc":     "Has very few threads bookmarked",
            "achieved": "false"
        },
        {
            "title":    "Looks good!",
            "type":     "bronze",
            "desc":     "Liked 20 ideas",
            "achieved": "false"
        },
        {
            "title":    "Community Starter",
            "type":     "bronze",
            "desc":     "Written 10 threads",
            "achieved": "false"
        },
        {
            "title":    "Cleaner",
            "type":     "bronze",
            "desc":     "Moved some threads",
            "achieved": "false"
        },
        {
            "title":    "Very first, much completed",
            "type":     "bronze",
            "desc":     "First time getting your idea completed!",
            "achieved": "false"
        },
        {
            "title":    "Collection Agent",
            "type":     "bronze",
            "desc":     "Collected 50 Achievements.",
            "achieved": "false"
        },
        {
            "title":    "Mouth Gagger",
            "type":     "bronze",
            "desc":     "Silenced 10 users",
            "achieved": "false"
        },
        {
            "title":    "Wonderer",
            "type":     "bronze",
            "desc":     "Asked a question in FAQ",
            "achieved": "false"
        },
        {
            "title":    "Storage Manager",
            "type":     "bronze",
            "desc":     "Uploaded 10 images.",
            "achieved": "false"
        },
        {
            "title":    "You've got potential",
            "type":     "bronze",
            "desc":     "Gotten 5 ideas accepted in ideabox",
            "achieved": "false"
        },
        {
            "title":    "Request Uploader",
            "type":     "bronze",
            "desc":     "Posted 20 approved torrents in the request section.",
            "achieved": "false"
        },
        {
            "title":    "Walk in the Park",
            "type":     "bronze",
            "desc":     "Approved and given uploading privileges to 50 users",
            "achieved": "false"
        },
        {
            "title":    "Found it!",
            "type":     "bronze",
            "desc":     "Has submitted 40 torrents in the request section",
            "achieved": "false"
        },
        {
            "title":    "Socializing",
            "type":     "bronze",
            "desc":     "Has 250 friends",
            "achieved": "false"
        },
        {
            "title":    "Poster",
            "type":     "bronze",
            "desc":     "Posted in the forums a thousand times!",
            "achieved": "false"
        },
        {
            "title":    "Upvote Rookie",
            "type":     "bronze",
            "desc":     "Has 500 likes on their torrents.",
            "achieved": "false"
        },
        {
            "title":    "Kategorizer",
            "type":     "bronze",
            "desc":     "A user holding a Super User rank or higher moving over 250 torrents to it's rightful categories.",
            "achieved": "false"
        },
        {
            "title":    "Request Reporter",
            "type":     "bronze",
            "desc":     "Reported 10 Torrent Requests",
            "achieved": "false"
        },
        {
            "title":    "WikiHow: Write a Summary",
            "type":     "bronze",
            "desc":     "Has Submitted 20 Summaries",
            "achieved": "false"
        },
        {
            "title":    "2015: KickAss Upload Day Starter",
            "type":     "bronze",
            "desc":     "You Kicked Off KickAss upload Day with a few Kick Ass Uploads!",
            "achieved": "false"
        },
        {
            "title":    "Spam Spotter",
            "type":     "bronze",
            "desc":     "Reported over 50 comments.",
            "achieved": "false"
        },
        {
            "title":    "First Torrent Downloaded",
            "type":     "simple",
            "desc":     "Downloaded first torrent.",
            "achieved": "false"
        },
        {
            "title":    "First Comment",
            "type":     "simple",
            "desc":     "Left first comment.",
            "achieved": "false"
        },
        {
            "title":    "First Feedback",
            "type":     "simple",
            "desc":     "Left first feedback.",
            "achieved": "false"
        },
        {
            "title":    "First Status Update",
            "type":     "simple",
            "desc":     "Made first status update.",
            "achieved": "false"
        },
        {
            "title":    "First Upload",
            "type":     "simple",
            "desc":     "Uploaded first torrent.",
            "achieved": "false"
        },
        {
            "title":    "Organizer",
            "type":     "simple",
            "desc":     "First category change.",
            "achieved": "false"
        },
        {
            "title":    "Critic",
            "type":     "simple",
            "desc":     "Left first negative comment rating.",
            "achieved": "false"
        },
        {
            "title":    "Supporter",
            "type":     "simple",
            "desc":     "Left first positive comment rating.",
            "achieved": "false"
        },
        {
            "title":    "Look at me!",
            "type":     "simple",
            "desc":     "Changed avatar once",
            "achieved": "false"
        },
        {
            "title":    "Community Noob",
            "type":     "simple",
            "desc":     "Written a thread",
            "achieved": "false"
        },
        {
            "title":    "What's this for?",
            "type":     "simple",
            "desc":     "Created a signature!",
            "achieved": "false"
        },
        {
            "title":    "Quick, hide!",
            "type":     "simple",
            "desc":     "Submitted nickname change request",
            "achieved": "false"
        },
        {
            "title":    "Achievement Collector",
            "type":     "simple",
            "desc":     "Collected 20 Achievements.",
            "achieved": "false"
        },
        {
            "title":    "Look at my drawing!",
            "type":     "simple",
            "desc":     "Uploaded an image",
            "achieved": "false"
        },
        {
            "title":    "First Like",
            "type":     "simple",
            "desc":     "Your torrent has received it's first upvote, congratulations!",
            "achieved": "false"
        }
    ];

    $('#wrapper').html('<style>h1{font-family:Georgia, "Times New Roman", Times, serif;font-size:26px;margin:0 0 10px 0}h1,h2,h3,h4,h5{color:#99742e;font-weight:normal;padding:0;margin-top:0;margin:0 0 5px 0;font-family:Tahoma, Verdana, Arial, Helvetica, sans-serif}#wrapper{font-size:12px;}.simpleAchIcon,.bronzeAchIcon,.silverAchIcon,.goldAchIcon,.specialAchIcon{border-radius:2px 0px 0px 2px;float:left;height:17px;width:17px;background:rgba(0, 0, 0, 0.5) url("https://pximg.xyz/images/c30ed775d9a2180d565eb070846b0737.png") repeat scroll 0% 0%/auto 100%;vertical-align:middle}.achTitle{color:white;padding:1px 4px;font-size:10px;vertical-align:top;display:inline-block;height:15px;line-height:15px}.achBadge{vertical-align:middle;height:17px;min-width:20px;max-width:500px;margin:1px 5px 2px 0px;border-radius:2px;display:inline-block;line-height:1.1em;}.specialAchBack{background-color:#AF9DDC}.goldAchBack{background-color:#BB9B1A}.silverAchBack{background-color:#8D92A3}.bronzeAchBack{background-color:#C27E47}.simpleAchBack{background-color:#939393}.goldAchIcon{background-position:-17px;}.silverAchIcon{background-position:-34px}.bronzeAchIcon{background-position:-51px}.simpleAchIcon{background-position:-68px}</style>\
<div style="margin-top: 100px; margin-left: 100px;"><h1>Total Achievements ('+cheevos.length+')</h1><ul></ul></div>');

    for (let i = 0; i < cheevos.length; i++) {
        $('#wrapper ul').append('<li style="list-style:none;">\
<span class="achBadge '+cheevos[i].type+'AchBack "><a title="'+cheevos[i].title+'"><span class="'+cheevos[i].type+'AchIcon"></span><span class="achTitle">'+cheevos[i].title+'</span></a></span>\
<strong>x ?</strong>&nbsp;&nbsp;<span class="achDesc">'+cheevos[i].desc+'</span>\
</li>');
    }
})();
