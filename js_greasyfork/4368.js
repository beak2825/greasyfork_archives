// ==UserScript==
// @name         Mememmeee
// @version      1.3
// @description  Memes
// @match        http://instasynch.com/rooms/Ebolmao
// @grant        none
// @copyright    2014
// @namespace http://use.i.E.your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/4368/Mememmeee.user.js
// @updateURL https://update.greasyfork.org/scripts/4368/Mememmeee.meta.js
// ==/UserScript==

// emote script for greasemonkey or tampermonkey.
// $codes[""] = \'<img src="">\'; \


var script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = ' \
        setTimeout(function(){ \
        $codes["anita"] = \'<img src="http://i.imgur.com/uWCIsFe.jpg">\'; \
        $codes["b8"] = \'<img src="http://i.imgur.com/Ovw6xXO.png">\'; \
        $codes["don"] = \'<img src="http://i.imgur.com/89L9A91.jpg">\'; \
        $codes["euphoric"] = \'<img src="http://i.imgur.com/PMSozUd.gif">\'; \
        $codes["faggot"] = \'<img src="http://i.imgur.com/a9s1d0w.gif">\'; \
        $codes["fricks"] = \'<img src="http://i.imgur.com/YkwZyPp.png">\'; \
        $codes["fuck"] = \'<img src="http://i.imgur.com/5Yxno3l.gif">\'; \
        $codes["fuckyou"] = \'<img src="http://i.imgur.com/ntjMeGG.jpg">\'; \
        $codes["girugamesh"] = \'<img src="http://i.imgur.com/LOncIUM.png">\'; \
        $codes["guesswho"] = \'<img src="http://i.imgur.com/QNGCAAH.jpg">\'; \
        $codes["hitler"] = \'<img src="http://i.imgur.com/DubUV7N.gif">\'; \
        $codes["lol"] = \'<img src="http://i.imgur.com/XXOfQPN.jpg">\'; \
        $codes["m8"] = \'<img src="http://i.imgur.com/d9Oa6h7.jpg">\'; \
        $codes["jewte"] = \'<img src="http://i.imgur.com/husDX2Q.gif">\'; \
        $codes["mfw"] = \'<img src="http://i.imgur.com/G3eyHsI.jpg">\'; \
        $codes["wut"] = \'<img src="http://i.imgur.com/F0yes78.jpg">\'; \
        $codes["cringe"] = \'<img src="http://i.imgur.com/F0yes78.jpg">\'; /* alternate */ \
        $codes["spaghetti"] = \'<img src="http://i.imgur.com/S9fbEix.jpg">\'; \
        $codes["swee"] = \'<img src="http://i.imgur.com/ZDSpbU7.jpg">\'; \
        $codes["takeasit"] = \'<img src="http://i.imgur.com/rkSVlPU.jpg">\'; \
        $codes["thasrite"] = \'<img src="http://i.imgur.com/tY7uaA3.jpg">\'; \
        $codes["trap"] = \'<img src="http://i.imgur.com/1SRQfd3.gif">\'; \
        $codes["unoeme"] = \'<img src="http://i.imgur.com/EecZTul.jpg">\'; \
        $codes["doot"] = \'<img src="http://i.imgur.com/kgBJs0E.gif">\'; \
        $codes["yiss"] = \'<img src="http://i.imgur.com/cgJlRIC.jpg">\'; \
        $codes["deof"] = \'<img src="http://i.imgur.com/DgvgcL7.jpg">\'; \
        $codes["2spooky"] = \'<img src="http://i.imgur.com/gWD0hHh.gif">\'; \
        $codes["ainsley"] = \'<img src="http://i.imgur.com/GFfkW9C.png">\'; \
        $codes["alien"] = \'<img src="http://i.imgur.com/DhrPa3h.gif">\'; \
        $codes["autism"] = \'<img src="http://i.imgur.com/XrOfXJb.gif">\'; \
        $codes["stanza"] = \'<img src="http://i.imgur.com/hKQwco1.png">\'; \
        $codes["darksided"] = \'<img src="http://i.imgur.com/srNhBAd.jpg">\'; \
        $codes["dewritos"] = \'<img src="http://i.imgur.com/nAv6IhA.gif">\'; \
        $codes["gitmo"] = \'<img src="http://i.imgur.com/gdTaOYP.jpg">\'; \
        $codes["go"] = \'<img src="http://i.imgur.com/t9WGcrU.gif">\'; \
        $codes["happening"] = \'<img src="http://i.imgur.com/67rrEd5.gif">\'; \
        $codes["illuminati"] = \'<img src="http://i.imgur.com/B8vSTN4.gif">\'; \
        $codes["kenya"] = \'<img src="http://i.imgur.com/ah5UZSH.png">\'; \
        $codes["mudslime"] = \'<img src="http://i.imgur.com/XX7vrvc.jpg">\'; \
        $codes["obamacare"] = \'<img src="http://i.imgur.com/2lABt5F.jpg">\'; \
        $codes["octagon"] = \'<img src="http://i.imgur.com/naZ6eUm.png">\'; \
        $codes["stop"] = \'<img src="http://i.imgur.com/naZ6eUm.png">\'; /* alternate */ \
        $codes["predator"] = \'<img src="http://i.imgur.com/Ncp4LN1.jpg">\'; \
        $codes["rage"] = \'<img src="http://i.imgur.com/zWa3XkS.jpg">\'; \
        $codes["spurdo"] = \'<img src="http://i.imgur.com/phGI4FS.gif">\'; \
        $codes["o-o"] = \'<img src="http://i.imgur.com/xDEoDXD.gif">\'; \
        $codes["why"] = \'<img src="http://i.imgur.com/b7wkrhU.png">\'; \
        $codes["supasnoop"] = \'<img src="http://i.imgur.com/k27Xp9K.gif">\'; \
        $codes["gigaduane"] = \'<img src="http://i.imgur.com/J48994t.gif">\'; \
        $codes["slam"] = \'<img src="http://i.imgur.com/91TR02m.png">\'; \
        $codes["heaven"] = \'<img src="http://i.imgur.com/orQuKGs.jpg">\'; \
        $codes["deepdarkfantasy"] = \'<img src="http://i.imgur.com/PafRm0J.png">\'; \
        $codes["van"] = \'<img src="http://i.imgur.com/PafRm0J.png">\'; /* alternate */ \
        $codes["oshi"] = \'<img src="http://i.imgur.com/WI0Kk2n.png">\'; \
        $codes["youtoo"] = \'<img src="http://i.imgur.com/GDZjehE.jpg">\'; \
        $codes["nicehd"] = \'<img src="http://i.imgur.com/n7gKxLw.jpg">\'; \
        $codes["based"] = \'<img src="http://i.imgur.com/Kg1CRtj.jpg">\'; \
        $codes["doubt"] = \'<img src="http://i.imgur.com/KwRNrbe.png">\'; \
        $codes["disgonbgud"] = \'<img src="http://i.imgur.com/2Zdn7If.gif">\'; \
        $codes["lenewfunnymeme"] = \'<img src="http://i.imgur.com/Kf5M4gk.jpg">\'; \
        $codes["fluffe"] = \'<img src="http://i.imgur.com/Kf5M4gk.jpg">\'; /* alternate */ \
        $codes["bro"] = \'<img src="http://i.imgur.com/kyLP3Fe.gif">\'; \
        $codes["notcp"] = \'<img src="http://i.imgur.com/A1G6DES.gif">\'; \
        $codes["kawaii"] = \'<img src="http://i.imgur.com/osd1Dnh.jpg">\'; \
        $codes["blue"] = \'<img src="http://i.imgur.com/UnuYcOq.jpg">\'; \
        $codes["moobie"] = \'<img src="http://i.imgur.com/U3owidV.gif">\'; \
        $codes["oyvey"] = \'<img src="http://i.imgur.com/q8R5bzx.png">\'; \
        $codes["queen"] = \'<img src="http://i.imgur.com/LTbOmxw.png">\'; \
        $codes["^"] = \'<img src="http://i.imgur.com/iqOsy3T.png">\'; \
        $codes["this"] = \'<img src="http://i.imgur.com/iqOsy3T.png">\'; /* alternate */ \
        $codes["feelsfrogman"] = \'<img src="http://i.imgur.com/H4Eur5e.png">\'; \
        $codes["mahnigga"] = \'<img src="http://i.imgur.com/n7DKxRj.png">\'; \
        $codes["no"] = \'<img src="http://i.imgur.com/ktqee5Z.gif">\'; \
        $codes["oh"] = \'<img src="http://i.imgur.com/bV00Tu5.gif">\'; \
        $codes["shake"] = \'<img src="http://i.imgur.com/z4wZh7T.jpg">\'; \
        $codes["ronno"] = \'<img src="http://i.imgur.com/dlOfXHn.gif">\'; \
        $codes["supasanic"] = \'<img src="http://i.imgur.com/ZP7xZnQ.gif">\'; \
        $codes["psssh"] = \'<img src="http://i.imgur.com/USJW11o.jpg">\'; \
        $codes["bueno"] = \'<img src="http://i.imgur.com/yP96WbG.jpg">\'; \
        $codes["ulike"] = \'<img src="http://i.imgur.com/f1e6Hub.jpg">\'; \
        $codes["uiop"] = \'<img src="http://i.imgur.com/boInvRu.gif">\'; \
        $codes["laurgasm"] = \'<img src="http://i.imgur.com/MmWAO7q.png">\'; \
        $codes["le"] = \'<img src="http://i.imgur.com/8afz3Tp.png">\'; \
        $codes["ironman"] = \'<img src="http://i.imgur.com/fVYIEPG.gif">\'; \
        $codes["mute"] = \'<img src="http://i.imgur.com/aRE4Kvh.gif">\'; \
        $codes["michelle"] = \'<img src="http://i.imgur.com/akoXY1x.png">\'; \
        $codes["socialist"] = \'<img src="http://i.imgur.com/nCC93LC.png">\'; \
        $codes["bipartisan"] = \'<img src="http://i.imgur.com/5FdM7bn.png">\'; \
        $codes["spookyscary"] = \'<img src="http://i.imgur.com/HqwKgPZ.gif">\'; \
        $codes["bah"] = \'<img src="http://i.imgur.com/l4J6XKi.gif">\'; \
        $codes["bong"] = \'<img src="http://i.imgur.com/GVWsLze.png">\'; \
        $codes["boom"] = \'<img src="http://i.imgur.com/eHJYRya.gif">\'; \
        $codes["shrek"] = \'<img src="http://i.imgur.com/uFhaA4H.png">\'; \
        $codes["doritos"] = \'<img src="http://i.imgur.com/LFQwxei.png">\'; \
        $codes["euphoria"] = \'<img src="http://i.imgur.com/pUd1UOA.gif">\'; \
        $codes["fedora"] = \'<img src="http://i.imgur.com/uwZYW6Y.png">\'; \
        $codes["hjkl"] = \'<img src="http://i.imgur.com/MdGzwCD.gif">\'; \
        $codes["gaben"] = \'<img src="http://i.imgur.com/FuHgc9r.gif">\'; \
        $codes["hit"] = \'<img src="http://i.imgur.com/FAisAGC.png">\'; \
        $codes["horn"] = \'<img src="http://i.imgur.com/YYpKTbr.gif">\'; \
        $codes["idk"] = \'<img src="http://i.imgur.com/1YHATjD.png">\'; \
        $codes["joint"] = \'<img src="http://i.imgur.com/ybj5X63.png">\'; \
        $codes["lenny"] = \'<img src="http://i.imgur.com/3mYXRHE.png">\'; \
        $codes["marijuana"] = \'<img src="http://i.imgur.com/Kb7nhsU.png">\'; \
        $codes["mlg"] = \'<img src="http://i.imgur.com/Gdvhfg3.png">\'; \
        $codes["mtndew"] = \'<img src="http://i.imgur.com/Nngu3RU.png">\'; \
        $codes["seals"] = \'<img src="http://i.imgur.com/mLw8REe.gif">\'; \
        $codes["pizza"] = \'<img src="http://i.imgur.com/e6qtBPk.gif">\'; \
        $codes["bnm"] = \'<img src="http://i.imgur.com/WujbPax.gif">\'; \
        $codes["greenfrog"] = \'<img src="http://i.imgur.com/yqUdv6c.gif">\'; \
        $codes["quikscope"] = \'<img src="http://i.imgur.com/EvloZcY.gif">\'; \
        $codes["sampletext"] = \'<img src="http://i.imgur.com/UF6bUys.png">\'; \
        $codes["snoopgirls"] = \'<img src="http://i.imgur.com/48EMDud.gif">\'; \
        $codes["spookdance"] = \'<img src="http://i.imgur.com/hlvPOGS.gif">\'; \
        $codes["wow"] = \'<img src="http://i.imgur.com/Gx5wmqn.gif">\'; \
        $codes["brazzers"] = \'<img src="http://i.imgur.com/ryivhFU.jpg">\'; \
        $codes["bluesclues"] = \'<img src="http://i.imgur.com/OVPN6AC.gif">\'; \
        $codes["wam"] = \'<img src="http://i.imgur.com/mCPiGok.png">\'; \
        $codes["venus"] = \'<img src="http://i.imgur.com/ln9zoA8.gif">\'; \
        $codes["tape"] = \'<img src="http://i.imgur.com/saBrF88.gif">\'; \
        $codes["swamp"] = \'<img src="http://i.imgur.com/BLmrRZm.gif">\'; \
        $codes["browfrog"] = \'<img src="http://i.imgur.com/rzV7Ft4.gif">\'; \
        $codes["420"] = \'<img src="http://i.imgur.com/Moxgo26.gif">\'; \
        $codes["dealfrog"] = \'<img src="http://i.imgur.com/sGtAsKn.gif">\'; \
        $codes["getrekt"] = \'<img src="http://i.imgur.com/Gp5leNo.gif">\'; \
        $codes["knishes"] = \'<img src="http://i.imgur.com/Pr1dPNc.gif">\'; \
        $codes["pussy"] = \'<img src="http://i.imgur.com/1VVnYfR.gif">\'; \
        $codes["awesome"] = \'<img src="http://i.imgur.com/51V6Frw.gif">\'; \
        $codes["neckbeardlol"] = \'<img src="http://i.imgur.com/ZaXvScy.gif">\'; \
        $codes["niggalol"] = \'<img src="http://i.imgur.com/IHMfX1v.gif">\'; \
        $codes["topkek"] = \'<img src="http://i.imgur.com/VOhCgkC.gif">\'; \
        $codes["swag"] = \'<img src="http://i.imgur.com/OGoBVWj.jpg">\'; \
        $codes["stepitup"] = \'<img src="http://i.imgur.com/WIWots6.png">\'; \
        $codes["gofast"] = \'<img src="http://i.imgur.com/qfOW878.gif">\'; \
        $codes["leshrug"] = \'<img src="http://i.imgur.com/jdrDmCU.gif">\'; \
        $codes["lolita"] = \'<img src="http://i.imgur.com/NAPxXD1.gif">\'; \
        $codes["ayylmao"] = \'<img src="http://i.imgur.com/grzlkIC.jpg">\'; \
        $codes["reversemute"] = \'<img src="http://i.imgur.com/JESY8Zw.gif">\'; \
        $codes["sickwobs"] = \'<img src="http://i.imgur.com/6QmzMBR.gif">\'; \
        $codes["pumpkindance"] = \'<img src="http://i.imgur.com/bEWkh5Y.gif">\'; \
        $codes["mum"] = \'<img src="http://i.imgur.com/o31dqAO.png">\'; \
        $codes["antime"] = \'<img src="http://i.imgur.com/VrQFUZP.jpg">\'; \
        $codes["ca"] = \'<img src="http://i.imgur.com/t2t6hm1.gif">\'; \
        $codes["jp"] = \'<img src="http://i.imgur.com/Nffo2UR.gif">\'; \
        $codes["ru"] = \'<img src="http://i.imgur.com/f0DAS6G.gif">\'; \
        $codes["uk"] = \'<img src="http://i.imgur.com/SbNJ2tq.gif">\'; \
        $codes["aus"] = \'<img src="http://i.imgur.com/Wpw7XN2.gif">\'; \
        $codes["nz"] = \'<img src="http://i.imgur.com/ZYcwsa1.gif">\'; \
        $codes["muhsojiny"] = \'<img src="http://i.imgur.com/VUsSyhS.jpg">\'; \
        $codes["snibeti"] = \'<img src="http://i.imgur.com/EeSexJu.png">\'; \
        $codes["leld"] = \'<img src="http://i.imgur.com/nmgAf6O.jpg">\'; \
        $codes["rusrs"] = \'<img src="http://i.imgur.com/7jafbiI.jpg">\'; \
        $codes["bitch"] = \'<img src="http://i.imgur.com/Efczm4v.jpg">\'; \
        $codes["mex"] = \'<img src="http://i.imgur.com/mMtrKYK.gif">\'; \
        $codes["omg"] = \'<img src="http://i.imgur.com/EAYDf4w.jpg">\'; \
        $codes["podracing"] = \'<img src="http://i.imgur.com/1UH7sWe.jpg">\'; \
        $codes["rusure"] = \'<img src="http://i.imgur.com/HxfrD7n.png">\'; \
        $codes["absolutely"] = \'<img src="http://i.imgur.com/gsUPzs8.jpg">\'; \
        $codes["bernie"] = \'<img src="http://i.imgur.com/1yncpDa.jpg">\'; \
        $codes["waisis"] = \'<img src="http://i.imgur.com/8HDiOIb.gif">\'; \
        $codes["stopposting"] = \'<img src="http://i.imgur.com/BMnVxAw.gif">\'; \
        $codes["hellno"] = \'<img src="http://i.imgur.com/5NFdCQ4.jpg">\'; \
        $codes["jesus"] = \'<img src="http://i.imgur.com/8bJ89MW.jpg">\'; \
        $codes["edgy"] = \'<img src="http://i.imgur.com/uOzyYGx.jpg">\'; \
        $codes["doglol"] = \'<img src="http://i.imgur.com/wSUDVVw.jpg">\'; \
        $codes["pato"] = \'<img src="http://i.imgur.com/MzzETZR.gif">\'; \
        $codes["woop"] = \'<img src="http://i.imgur.com/vgp7VLW.gif">\'; \
        $codes["ilove"] = \'<img src="http://i.imgur.com/t2jKpIS.jpg">\'; \
        $codes["ukko"] = \'<img src="http://i.imgur.com/RPV1q9J.jpg">\'; \
        $codes["es"] = \'<img src="http://i.imgur.com/cOz5lEA.jpg">\'; \
        $codes["heat"] = \'<img src="http://i.imgur.com/2n0Uq9B.jpg">\'; \
        $codes["kissu"] = \'<img src="http://i.imgur.com/I2VEZzj.jpg">\'; \
        $codes["nibs"] = \'<img src="http://i.imgur.com/V0hJIXz.jpg">\'; \
        $codes["kim"] = \'<img src="http://i.imgur.com/lYQ0Sg0.jpg">\'; \
        $codes["murrifat"] = \'<img src="http://i.imgur.com/2eC6x9Z.gif">\'; \
        $codes["adolf"] = \'<img src="http://i.imgur.com/aoyLsDg.jpg">\'; \
        $codes["fat"] = \'<img src="http://i.imgur.com/7pU4jLt.gif">\'; \
        $codes["murricajesus"] = \'<img src="http://i.imgur.com/wu4nDVC.gif">\'; \
        $codes["mmmmm"] = \'<img src="http://i.imgur.com/tbhRSFu.gif">\'; \
        $codes["purjo"] = \'<img src="http://i.imgur.com/jArre9w.gif">\'; \
        $codes["dungeonmaster"] = \'<img src="http://i.imgur.com/8nlblTp.gif">\'; \
        $codes["pate"] = \'<img src="http://i.imgur.com/oAfAk3I.gif">\'; \
        $codes["kimdigii"] = \'<img src="http://i.imgur.com/RBU1LPG.gif">\'; \
        $codes["!"] = \'<img src="http://i.imgur.com/upDN851.gif">\'; \
        $codes["die"] = \'<img src="http://i.imgur.com/UXgeILP.gif">\'; \
        $codes["fi"] = \'<img src="http://i.imgur.com/yyGB56i.gif">\'; \
        $codes["mario"] = \'<img src="http://i.imgur.com/lLbfzUA.gif">\'; \
        $codes["mlady"] = \'<img src="http://i.imgur.com/IosqtdI.gif">\'; \
        $codes["damngood"] = \'<img src="http://i.imgur.com/xvApSIU.gif">\'; \
        $codes["terrific"] = \'<img src="http://i.imgur.com/75wqRDS.gif">\'; \
        $codes["muik"] = \'<img src="http://i.imgur.com/k45iZR4.gif">\'; \
        $codes["es1"] = \'<img src="http://i.imgur.com/7mAT1E3.gif">\'; \
        $codes["fku"] = \'<img src="http://i.imgur.com/8WH54ax.gif">\'; \
	}, 1500);'
        ;
document.body.appendChild(script);