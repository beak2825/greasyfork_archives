// ==UserScript==
// @name         Rue mod
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  An experimental mod for R74n's Rue
// @author       An Orbit
// @match        https://r74n.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=r74n.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470703/Rue%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/470703/Rue%20mod.meta.js
// ==/UserScript==

(function() {
    var swearRegex = RegExp('},1{)?)y|ecaf|daeh|gni|eloh|kcits|rekcus|rekcil|re|] -\\[|s?e|()|kcollob|erohw|ttuls|tuls|yssup|kcoc|tnuc|stit|ssa|hctib|kcid|ttihs|)|ym(muc|tihs|tihs|tawt|parc|kcuf|esra(()|)?]-\\ [)|ym]-\\ [())tae|kcus|kcil(|woc|tab|uoy|god|esroh|llub((('.split("").reverse().join(""));
    var blackpinkResponse = ["blackpink>>>In {{i|my}} area?", "blackpink>>>I love {{c:Whistle|Boombayah|Playing With Fire|Stay|As If It's Your Last|Ddu-du Ddu-du|Forever Young|Really|See U Later|Kiss And Make Up|Kill This Love|Don't Know What To Do|Kick It|Hope Not|Sour Candy|Lovesick Girls|Bet You Wanna|How You Like That|Ice Cream|Pretty Savage|Crazy Over You|Love To Hate Me|You Never Know|Pink Venom|Shut Down|Typa Girl|Yeah Yeah Yeah|Hard To Love|The Happiest Girl|Tally|Ready For Love|Solo|Flower|All Eyes On Me|Lalisa|Money|On The Ground|Gone}}", "blackpink>>>Stan Blackpink!", "blackpink>>>BLACKPINK is the revolution."];
    var lgbtRegex = /^i('| a|)m (a |)(gay|lesbian|sapphic|queer|gender(queer|fluid)|achillean|enby|nonbinary|ace|a(sexual|romantic|gender)|trans(gender|sexual|)|(bi|demi|pan)(gender)|(homo|bi|demi|pan|omni)(sexual|romantic|)|(lg|gl)btq?i?a?(2s?|)\+?|a (boy|girl)).*/; //Rue says LGBT rights.
    var tRegex2 = /^i was (born |)a (boy|girl),? but (now |)i('| a)m (actually |)a (boy|girl).*/;
    var bodilyFluidRegex = RegExp('))raewrednu|seitnap|stnap( ym)| ni(|flesym)| no(( )deelb|muc|eep|delb|demmuc|emac|deep|)|det(t]ai[hs|)|de|t(ssip()| tsuj( i'.split("").reverse().join(""));
    var poopSqueezeRegex = RegExp('*.meht ))|gni(nettalf|)|gni(hsurc|)e|gni(zeeuqs( dna ?s)secef|tacs|parc|)ei|y(kood|loots|pmud|?poop|tihs|drut(? *. ))|gni(dloh|)|gnit(teg|)|gnib(barg|)e|gni(kat()| )|ot (ekil( i'.split("").reverse().join(""));
    var eatingGrossRegex = RegExp('*.?s)diulf lanimes|mreps|zzij|tun|knups|nemes|muc|eniru|ssip|eep|pmud|secef|tacs|drut|parc|?poop|tihs(? *. )|no ()|gni()?etib|kcans|hcnum|kcil|kcus|pruls|knird|tae()| )|ot (ekil( i'.split("").reverse().join(""));

    Rue.disgusted = function(message) {
        Rue.say(message, {color:"#b7cf1f",bg:"#797d43"})
    }

    Rue.blackpink = function(message) {
        Rue.say(message, {color:"#ffc2e7",bg:"black"})
    };

    Rue.grossedOut = function() {
        Rue.disgusted("That's it. I'm leaving.");
        document.getElementById("rueInput").setAttribute("disabled","true");
        setTimeout(function() {
            Rue.sleep(20051106)
        }, 2000);
    }
//

    var rueMessageBoxSize = 308; //parseInt(document.getElementById("rueMessageBox").style.width.match(/\d+/)[0]) - 16
    var size = rueMessageBoxSize - 16;

    Rue.modAudioTag = document.createElement("audio");
    Rue.youtubeEmbedIframe = document.createElement("iframe");
    var attributes = {
        "width": (size).toString(),
        "height": Math.round(size * 318 / 560).toString(),
        "title": "YouTube video player",
        "frameborder": "0",
        "allow": "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", //yikes
        "allowfullscreen": ""
        //"src": "https://www.youtube.com/embed/VideoID"
    };
    for(var key in attributes) {
        Rue.youtubeEmbedIframe.setAttribute(key,attributes[key])
    };

    function tryToFindYoutubeID(string) {
        var idFromLink = string.match(/v=([A-Za-z0-9_\-]+)/)?.[1];
        if(idFromLink) {
            return idFromLink
        };
        var idFromEnd = string.match(/[A-Za-z0-9_\-]+$/)?.[0];
        if(idFromEnd) { //Also matches lone ID
            return idFromEnd
        };
        var idFromRegex = string.match(/([A-Za-z0-9_\-]+)/g);
        if(idFromRegex) {
            var ids = idFromRegex.filter(function(str) { return str.length > 7 && str.length < 14});
            if(ids.length > 0) {
                return ids[0]
            }
        };
        return null
    };

    Rue.addRueData(
        {
            favorites: {
                "girl group": "EXID",
                "kep1er song": '<span style="color:#fc2dfc">We Fresh</span>' //cry about it
            },
            commands: {
                [poopSqueezeRegex]: Rue.grossedOut,
                [eatingGrossRegex]: Rue.grossedOut,
                "play audio": function(args) {
                    if(args[0] == "" || args.length < 1) {
                        Rue.error("Please provide a link to an audio file");
                        return
                    };
                    Rue.modAudioTag.setAttribute("src",args[0]);
                    Rue.modAudioTag.setAttribute("controls","true");
                    //Dummy Rue.say so that the rueMessageBox exists
                    Rue.say("Loading...");
                    //HTMLAudioElement.play() returns a Promise so I'm trying to use that to my advantage
                    Rue.modAudioTag.play().then(
                        //Success callback
                        function() {
                            Rue.success("Here you go!")
                            //Try to re-append so the tag appears after the text
                            document.getElementById("rueMessageBox").appendChild(Rue.modAudioTag);
                            Rue.sticky()
                        },
                        //Failure callback
                        function() {
                            //No need to show the audio controls if it didn't work?
                            Rue.error("Sorry, I couldn't play that file.");
                            Rue.unsticky()
                        }
                    );
                },
                "play youtube": function(args) {
                    if(args[0] == "" || args.length < 1) {
                        Rue.error("Please provide a link or ID");
                        return
                    };
                    var id = tryToFindYoutubeID(args[0]);
                    if(id) {
                        Rue.youtubeEmbedIframe.setAttribute("src","https://www.youtube.com/embed/" + id);
                        Rue.success("Here you go!");
                        document.getElementById("rueMessageBox").appendChild(Rue.youtubeEmbedIframe);
                        Rue.sticky()
                    } else {
                        Rue.error("Sorry, I couldn't find a video ID.");
                        Rue.unsticky()
                    }
                }
            },
            responses: {
                [/dirt ?[,+] ?water/]: "You made Mud!",
                loona: ["Loona is 12!","Stan Loona","{{link:https://drive.google.com/drive/folders/15nOtXlSIKYD_anDn7PtDimHiyByzrjFa?usp=share_link|Burn BBC}}"],
                "이달의 소녀": "=loona",
                "stan loona": "=loona",
                "今月の少女": "=loona",
                "looπδ": "=loona",
                [/(stick|s|y)+/]: "=[unsure]",
                [swearRegex]: ["angry>>>That's not nice!","angry>>>Do you kiss your mother with that mouth?","angry>>>Those are bad words!","angry>>>Stop swearing!","angry>>>You're being naughty.","angry>>>That's rude!"],
                [/(stick|s|y)+/]: "=[unsure]",
                "comeouttorue": "love>>>I'm so {{c:happy|proud of you}}!",
                "i'm coming out": "=comeouttorue",
                "i'm coming out to you": "=comeouttorue",
                [lgbtRegex]: "=comeouttorue",
                [tRegex2]: "=comeouttorue",
                "alga recipe": "molten gallium + aluminum",
                "blackpink": blackpinkResponse,
                [bodilyFluidRegex]: ["disgusted>>>Eww...", "disgusted>>>That's {{c:gross|nasty|disgusting}}!", "disgusted>>>I didn't need to know that.", "disgusted>>>TMI."]
            }
        }
    );

})();