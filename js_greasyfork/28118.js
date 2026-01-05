// ==UserScript==
// @name           Star Citizen Bullshit Filter
// @description    Word Replacement for Star Citizen
// @namespace      Open Development
// @version        1.0.1
// @include        *robertsspaceindustries.com*
// @include        *reddit.com/r/starcitizen/*
// @copyright      2017-2042 All Parps Reserved
// @downloadURL https://update.greasyfork.org/scripts/28118/Star%20Citizen%20Bullshit%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/28118/Star%20Citizen%20Bullshit%20Filter.meta.js
// ==/UserScript==

(function() {
var replacements, regex, key, textnodes, node, s;
textnodes = document.evaluate( "//body//text()", document, null,
XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 1; i < textnodes.snapshotLength; i++) {
node = textnodes.snapshotItem(i);
if(node !== null && node.nodeName == '#text' && /\S/.test(node.nodeValue)) {

    s = node.data;
    //dates and patches
    s = s.replace( /\bsoon\b/gi, "never");
    s = s.replace( /\b2017\b/gi, "2024");
    s = s.replace( /\b2018\b/gi, "2025");
    s = s.replace( /\b2019\b/gi, "2026");
    s = s.replace( /\b2020\b/gi, "2027");
    s = s.replace( /\b2021\b/gi, "2028");
    s = s.replace( /\b2\.7\b/gi, "2.7 Jesus Patch");
    s = s.replace( /\b3\.0\b/gi, "3.0 Jesus Patch");
    //buzzwords
    s = s.replace( /\bFidelity\b/gi, "~FIDELITY~");
    s = s.replace( /\bBlocker\b/gi, "poor planning excuse");
    s = s.replace( /\bpipeline\b/gi, "excuse for delays");
    s = s.replace( /\bmilestone\b/gi, "public release");
    s = s.replace( /\bIteration\b/gi, "scrapped and started over");
    s = s.replace( /\bTeaser\b/gi, "pure marketing");
    s = s.replace( /\bVertical Slice\b/gi, "tech demo");
    s = s.replace( /\bCloud\b/gi, "AMAZON CLOUD");
    //job titles
    s = s.replace( /\bArtist\b/gi, "Jpeg creator");
    s = s.replace( /\bShip Artist\b/gi, "Jpeg coder");
    s = s.replace( /\bProgrammer\b/gi, "code layer");
    s = s.replace( /\bProgramming Lead\b/gi, "dedicated ideas guy");
    s = s.replace( /\bEmployee\b/gi, "CIG accomplice");
    s = s.replace( /\bEx-Employee\b/gi, "filthy leaver");
    s = s.replace( /\bLeaver\b/gi, "toxic dink");
    //technology
    s = s.replace( /\b64-Bit\b/gi, "fidelity precision");
    s = s.replace( /\bProcedural Animation\b/gi, "self annimating");
    s = s.replace( /\bProcedural\b/gi, "automatic");
    s = s.replace( /\bPlanned-Tech\b/gi, "Magic-Tech");
    s = s.replace( /\bPhysics\b/gi, "Physics grid");
    s = s.replace( /\bPhysics Grid\b/gi, "directional gravity map");
    s = s.replace( /\bCryEngine\b/gi, "CryEngine ?");
    //ships
    s = s.replace( /\bSpace Ship/gi, "space chariot");
    s = s.replace( /\bShip/gi, "space chariot");
    //specific ships
    s = s.replace( /\bJavelin\b/gi, "$2,500 MEGA space peen");
    s = s.replace( /\bIdris\b/gi, "limited edition $1,000+ space peen");
    //lingoisms
    s = s.replace( /\bUnforeseen\b/gi, "poor planning");
    s = s.replace( /\bUnexpected\b/gi, "things TheAgent warned everyone about");
    s = s.replace( /\bOpen Development\b/gi, "Openly Marketed");
    s = s.replace( /\bMost Open Development\b/gi, "MOST OPEN DEVELOPMENT EVER!");
    s = s.replace( /\bTransparent\b/gi, "opaque++");
    s = s.replace( /\bNever Done Before\b/gi, "Never Done Before for good reason");
    s = s.replace( /\bDesign Document\b/gi, "mostly just in our head");
    s = s.replace( /\bSpeculation\b/gi, "quantum design document");
    s = s.replace( /\bPlan\b/gi, "trick");
    s = s.replace( /\bLong.Term Plan\b/gi, "what we are working on tomorrow");
    s = s.replace( /\bWe are planning\b/gi, "what will never actually work but we dream about");
    s = s.replace( /\bexplain\b/gi, "excuse");
    s = s.replace( /\bPromise\b/gi, "smokescreen");
    s = s.replace( /\bTrust\b/gi, "money");
    s = s.replace( /\bATV\b/gi, "dedicated smokescreen show");
    s = s.replace( /\b10FTC\b/gi, "hand-waving techical debt video podcast");
    s = s.replace( /\bCommunication\b/gi, "Marketing and lies");
    s = s.replace( /\bGraphics\b/gi, "tightened graphics");
    s = s.replace( /\bMo.Cap\b/gi, "Money-Catapult");
    s = s.replace( /\bMoCap\b/gi, "Money-Catapult");
    s = s.replace( /\b100 Star.Systems\b/gi, "3 Star-Systems");
    s = s.replace( /\b3 Star.Systems\b/gi, "1 Star-System");
    s = s.replace( /\bAdvertised\b/gi, "thing that are never going to be done");
    s = s.replace( /\bInternal\b/gi, "non-existent");
    s = s.replace( /\bPledge/gi, "purchase");
    s = s.replace( /\bFinances\b/gi, "unlimited budget");
    s = s.replace( /\bMillion\b/gi, "small sum of money");
    s = s.replace( /\bConsumer.Base\b/gi, "untapped customers");
    s = s.replace( /\bAutomatic.Door\b/gi, "duct tape, rubber-bands, and a pocket knife");
    s = s.replace( /\bKickstarter \b/gi, "original lie");
    s = s.replace( /\bCitizencon\b/gi, "cult meeting");
    s = s.replace( /\bThe Pledge\b/gi, "CIGs documented lies");
    s = s.replace( /\bMVP\b/gi, "whatever CIG can squeeze out");
    s = s.replace( /\bTOS\b/gi, "iron-clad TOS");
    s = s.replace( /\bETA\b/gi, "ETA +6 months");
    s = s.replace( /\bConcept.Sale\b/gi, "backer squeeze");
    s = s.replace( /\bConcept.Art\b/gi, "dream jpeg");
    s = s.replace( /\bConcept.Piece\b/gi, "photo-bashed dream art");
    s = s.replace( /\bStock Art\b/gi, "free asset");
    s = s.replace( /\bPublisher\b/gi, "accountability demon");
    s = s.replace( /\bConsole\b/gi, "devil's device");
    s = s.replace( /\bPoly.Count\b/gi, "90,000 polygons");
    s = s.replace( /\bDevelopment.Tech\b/gi, "Purified-Magic");
    s = s.replace( /\bSub.System\b/gi, "what Chris was reading about while on vacation");
    s = s.replace( /\bSubsumption\b/gi, "AI");
    s = s.replace( /\bGrabby Hands\b/gi, "grabby module that will be done SOON");
    s = s.replace( /\bFlight Model\b/gi, "The flight blockers");
    //games
    s = s.replace( /\bElite Dangerous\b/gi, "The worst game on earth");
    s = s.replace( /\bLOD\b/gi, "the game that proves Star Citizen is good");
    s = s.replace( /\bLine.Of.Defense\b/gi, "the game that proves Star Citizen is good");
    s = s.replace( /\bWingcommander\b/gi, "Wing Commander (1999)");
    s = s.replace( /\bWing Commander\b/gi, "Wing Commander (1999)");
    //people and groups
    s = s.replace( /\bBacker/gi, "Sucker");
    s = s.replace( /\bDerek Smart\b/gi, "DEREK SMART!");
    s = s.replace( /\bDerek\b/gi, "DEREK SMART!");
    s = s.replace( /\bGoon\b/gi, "Goonie");
    s = s.replace( /\bGoons\b/gi, "Goons that are bitter about EVE");
    s = s.replace( /\bManofManyAliases\b/gi, "Toast");
    s = s.replace( /\bMoMA\b/gi, "Toast");
    s = s.replace( /\bBen Lesnick\b/gi, "Ben Lesnick, Developer");
    s = s.replace( /\bChris Roberts\b/gi, "Chris \"Make that pixel green\" Roberts");
    s = s.replace( /\bSandi Gardiner\b/gi, "failed actor, Sandi");
    s = s.replace( /\bAmazon\b/gi, "CIGs partner, Amazon");
    //misc
    s = s.replace( /\bin the works\b/gi, "being started soon");
    s = s.replace( /\bflyable\b/gi, "barely flyable and super janky");

node.data = s;
}} })();