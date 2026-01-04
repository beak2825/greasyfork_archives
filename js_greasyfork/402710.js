// ==UserScript==
// @name        CosmosisT's Weed Theme v1.0.3 (CTS ADDON)
// @version     1.0.3
// @description Addon designed by CosmosisT, for use with CTS; enable and enjoy!
// @author      CosmosisT(Addon Developer)
// @url         https://gist.github.com/CosmosisT
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts
// @grant       none
// @run-at      document-start
//              jshint esversion: 6
// @namespace   https://greasyfork.org/users/395685
// @downloadURL https://update.greasyfork.org/scripts/402710/CosmosisT%27s%20Weed%20Theme%20v103%20%28CTS%20ADDON%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402710/CosmosisT%27s%20Weed%20Theme%20v103%20%28CTS%20ADDON%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /*
    ===========================================================================================
     MAIN CODE INSERTION - ONLOAD
    ===========================================================================================
    */
    //INSERT PROJECT NAME & VERSION REQUIREMENTS
    var Project = {
        Name:"CosmosisT's Weed Theme",
        RequiredVersion:{
            //VERSION 1.6.33 MINIMUM
            Major:1,
            Minor:6,
            Patch:33
        }
    };
    //INSERT CODE BELOW
    function Main() {
        //VARIABLES
        var BGCOUNT = 0;
        //SET CTS HARD-CODE
        window.CTSEightBall = ["I'm too high for this!", "If you say so, how about you pass the weed?", "Without a doubt.", "Yes - definitely.", "You may rely on it, like I do my weed.", "As I see it, I can't I'm too stoned.", "Most Likely.", "Outlook good. How's it smell?", "Yes.", "Signs point to yes as well the bong.", "Reply hazy, might have been the weed.", "Ask again when you got $10.", "Better not tell you now. Snitch...", "I'm not your god... bug someone else!", "take a dab and ask again.", "Don't count on it.", "My reply is no.", "My dealers say no.", "Quality not so good.", "Very doubtful."];
        window.CTSWelcomes = ["What's stoney roney ", "What's smokin' ", "Hi ", "I thought I smelled a ", "Whatcha smokin' on ", "Cam up and toke ", "Yo ", "What's litty ", "what's good ", "What's hangin' "];
        //SET TEMPORARY CTS VALUES
        window.CTSAddon = {
            ReminderList: [
                // FOUR MINUTE WARNING
                ["1:16am","FOUR TILL THE TWENTY FOLKS!~"],["2:16am","FOUR TILL THE TWENTY FOLKS!~"],["3:16am","FOUR TILL THE TWENTY FOLKS!~"],["4:16am","FOUR TILL THE TWENTY FOLKS!~"],["5:16am","FOUR TILL THE TWENTY FOLKS!~"],["6:16am","FOUR TILL THE TWENTY FOLKS!~"],
                ["7:16am","FOUR TILL THE TWENTY FOLKS!~"],["8:16am","FOUR TILL THE TWENTY FOLKS!~"],["9:16am","FOUR TILL THE TWENTY FOLKS!~"],["10:16am","FOUR TILL THE TWENTY FOLKS!~"],["11:16am","FOUR TILL THE TWENTY FOLKS!~"],["12:16am","FOUR TILL THE TWENTY FOLKS!~"],
                ["12:16pm","FOUR TILL THE TWENTY FOLKS!~"],["1:16pm","FOUR TILL THE TWENTY FOLKS!~"],["2:16pm","FOUR TILL THE TWENTY FOLKS!~"],["3:16pm","FOUR TILL THE TWENTY FOLKS!~"],["4:16pm","FOUR TILL THE TWENTY FOLKS!~"],["5:16pm","FOUR TILL THE TWENTY FOLKS!~"],
                ["6:16pm","FOUR TILL THE TWENTY FOLKS!~"],["7:16pm","FOUR TILL THE TWENTY FOLKS!~"],["8:16pm","FOUR TILL THE TWENTY FOLKS!~"],["9:16pm","FOUR TILL THE TWENTY FOLKS!~"],["10:16pm","FOUR TILL THE TWENTY FOLKS!~"],["11:16pm","FOUR TILL THE TWENTY FOLKS!~"],
                // TWO MINUTE WARNING
                ["1:18am","TWO TILL THE TWENTY!~"],["2:18am","TWO TILL THE TWENTY!~"],["3:18am","TWO TILL THE TWENTY!~"],["4:18am","TWO TILL THE TWENTY!~"],["5:18am","TWO TILL THE TWENTY!~"],["6:18am","TWO TILL THE TWENTY!~"],
                ["7:18am","TWO TILL THE TWENTY!~"],["8:18am","TWO TILL THE TWENTY!~"],["9:18am","TWO TILL THE TWENTY!~"],["10:18am","TWO TILL THE TWENTY!~"],["11:18am","TWO TILL THE TWENTY!~"],["12:18pm","TWO TILL THE TWENTY!~"],
                ["1:18pm","TWO TILL THE TWENTY!~"],["2:18pm","TWO TILL THE TWENTY!~"],["3:18pm","TWO TILL THE TWENTY!~"],["4:18pm","TWO TILL THE TWENTY!~"],["5:18pm","TWO TILL THE TWENTY!~"],["6:18pm","TWO TILL THE TWENTY!~"],
                ["7:18pm","TWO TILL THE TWENTY!~"],["8:18pm","TWO TILL THE TWENTY!~"],["9:18pm","TWO TILL THE TWENTY!~"],["10:18pm","TWO TILL THE TWENTY!~"],["11:18pm","TWO TILL THE TWENTY!~"],["12:18am","TWO TILL THE TWENTY!~"],
                // CHEERS
                ["1:20am","CHEERS HAPPY TWENTY!!!"],["2:20am","CHEERS HAPPY TWENTY!!!"],["3:20am","CHEERS HAPPY TWENTY!!!"],["4:20am","CHEERS HAPPY TWENTY!!!"],["5:20am","CHEERS HAPPY TWENTY!!!"],["6:20am","CHEERS HAPPY TWENTY!!!"],
                ["7:20am","CHEERS HAPPY TWENTY!!!"],["8:20am","CHEERS HAPPY TWENTY!!!"],["9:20am","CHEERS HAPPY TWENTY!!!"],["10:20am","CHEERS HAPPY TWENTY!!!"],["11:20am","CHEERS HAPPY TWENTY!!!"],["12:20am","CHEERS HAPPY TWENTY!!!"],
                ["1:20pm","CHEERS HAPPY TWENTY!!!"],["2:20pm","CHEERS HAPPY TWENTY!!!"],["3:20pm","CHEERS HAPPY TWENTY!!!"],["4:20pm","CHEERS HAPPY TWENTY!!!"],["5:20pm","CHEERS HAPPY TWENTY!!!"],["6:20pm","CHEERS HAPPY TWENTY!!!"],
                ["7:20pm","CHEERS HAPPY TWENTY!!!"],["8:20pm","CHEERS HAPPY TWENTY!!!"],["9:20pm","CHEERS HAPPY TWENTY!!!"],["10:20pm","CHEERS HAPPY TWENTY!!!"],["11:20pm","CHEERS HAPPY TWENTY!!!"],["12:20pm","CHEERS HAPPY TWENTY!!!"]
            ],
            AKB: [
                "COSMOSIST","PATRICKHENDSBEE","KIRARA","CGLOBS","THEANSWER21","KINGBLAZE716","STEVIE0HZ","WIKKED","JOOJOO","BONGBLAZEMOBILE","THETRAPHOUSE","ASHLEYDONALDSON","ALIM996","MUCHMUSIC","BENSCOTT","FROSTSIEGE24",
                "AMIR84","IAMGREAT","HAVADAB","DABYOURFACE","ANGORA","HANABANANA","PSYTHEMOTHERSHIP","CHEERSEVERYBODY","HAVADAB3","MOUNTAINTOP","ZAM","STOIR","TAPATOTO","JANNEMAN","CORYINTHEHOUSE","ANAT0RRESS","THEDABPRINCESS",
                "INDICAASHLEYWHITE","FAMOUSECHO","DITZYDOLL502","BONZO","XYZZY","LOVECANNABIS","AVIMAHARI1","BERTHONYBEE","CRIT420","THESPACECADET","MARLEYCHEF","FOREVERZOTMEOW","GRIZZLY","HAZEYNATION","TOKERTRAV","GRIMZ235",
                "WHITEROOR210","LOHLIFE","LUCCA","CANNABISQUEENN","LADYBLUE4747","TY2TIMES","DEATHBOI","RAYCRANE","CHASEN","THROWEDGENJI","DANKAHONTAS","DRPATTCAKES","PEPS90","SMOKEVALLEY","BRUTALEPLIS","BONDJAMESB0ND","JAYKENNEDY",
                "SABRINAPOTOCNIK","TRUCKER954","STONEDNINJA","ANSI","CEEZYSGF","HOTCHATITIS","DEECASHH","IRISH2018","DOWNTOWNTOMATOES","NOHINNAME","ISAACSHAW","LITTLEDABBIE710","VASHTS80","ALWAYSSWAG","MELLOBLUEJAY","JIGGLEBILLYLOL",
                "RODNEYHUNTER","10PAST7","SAINTTOKERTRAV","GOPEPE","WEARZZY","DISHU","STONERCIRCLE","SLACKIETHEFIEND","LILPEEP","JAYPEA","THATGUY","SIXSTRINGG","OUTKASTFAN11","PHATBOI904","KIIONIONI","WILL","TTUCKSBRUH21",
                "CHRONTARIO","GIBBARISH","ERAYCELLATOLU","ALLAHUSNACKBAHH","ROSENROSEN5000","NUBBY","STEVENSCHMALZRIEDII","AQUALUNGZ","VONNEBITTERCUP","PHRANQUE","GNZPERZ","CRONIE","CIDERCHICK","AUG","COCARINA","CHRISTPHERJOURNET",
                "TWIZTIDANGEL1987","TADEU10","DESTROYERNINEZ","LACERDM","HEATHER1441","DAFLY","SKYKINGROCKLEE","OLLIE420","MAELILY","EARLIII","IAMDRLGLASS","JULESISBAKED","CROWJJ21","MAMACITA","CRISTOPHERDAVIS","TAMRIND42","FUCKINJAP",
                "EEYORE94","ADULTDAYCARE","GHOSTY","BIGBENZ","LANDING","PHAZEBRO","MAA5K","CHEFMARLEY","ASDASDASDADAS","DUTCHWITHSHANKS","DIRTYLOVE","DABQU33N","FKYOCOUCH","GROVES","NYVIKING","MEXICANMAMI","HUMAN408","SARAAR","JAYZAA",
                "GOISBARBOSAGOIS","OUTDACLOSETCREW","AGORAPHOBIC","BLAZINGCOUPLE949","RAVEGIRL24","HERBALPASSION","BUDDHALOVE","DIZZY","TOKINBOULDER","PRETTYLITTY","UNICORN","BOOBOOB","LEROYLOPEZ","BLACKTHOUGHT10","SIOSANDMAN","NUBBYY",
                "KEBER","DIRTNASTY","ZOOIEBLASTER","TINYDICKANDAHALF","ADAM1221","COLEW","BIOHAZARD93","OOF1234","NQRORNQRORY","MCATANIA","CLAMDUNK","ONTERRIBLE","PATRYCJAMAZIAREK","ZACHZACH","ORIGINALSIN","SKUFFEDWALDO",
                "TONGAWD","DELTA","BLAZEYE","BESTINTHEWORLD","MEMEYARABACI","BLAKELEINWEBER","HYBRIDTHEKID420","SILENCER30","JONATHANBLATNICA","UNITY2019GODHEAR","SIZEPLUS1","GEEK4LIFE91","G0DSUNWANTED1","SHERIFFM8","RALPHLEESTONE",
                "MACKY2","GRYFFINDOR","ANTIPLEB","LONEPHAROAH","KATEKRUNK","JIMBOGEEKN","GOLDENTREEFROG","BRANDONKROUSE","O0ST0NED0O","OIDUAYARX","DARKNESS","ANDYMATT","SOURDHARMA","MOMO196","HIGHDEAS","HERLADO420","PHOENIXFLARE",
                "THEREALHYPHEN","WWE2K","WYLDER","JERSEYTANKER","DRAYER","DRUMPF","WORLDCHILLZONE","DIZZYBLUD","AJBLACK21","KENDJO","MIKEMILES","WHITEARMOR","YOGIRSELLY","KORAZAUR","PURE","BERNDHETTICH","KRISSY420XOXO","IMFROMENGLAND",
                "KENT0","MATTYDABS","PAPATQ","JOHNNYBRAVO","MATRIARCH","BOSTON1211","JOJOOOOOO","ALSOTHISONE","SIMONOMIS","YAYOGAL420","TIAGODESANTANABROLLO","MARTINSTECIUK","DE4DF0X","NULL","HEAVENSPETALS","SEWING123","IANCOOPER",
                "HEYHEYHEY123","CR8ZYFLOW","TFOX","THEBUDLOUD","CODYSTEFFICK","NOTCRICKETS","LESGUITARS2","AEGAGRUS","STIFFLERXYZ","MRB88","DIEDIE","TAMOTSU","NAKANAKIS","TRIPLEXXXMC","VICKYKUK","CANADIANBACON666","STEVE234",
                "DOGEATER","CCHARR","ELEVEN","BITCHVIBE123","CARLITOCASTRO","CHILDOFJESUS","55NECATI55","TYLER32145","WHOABLACKBETTY","SMURFCOOKIE1993","SOCALGAL420","PHILIP42092","BABBYCROC","NATEMAC9","RAY84PARKER","TWISTEDSHOWTIE",
                "BRASHDVIRGO","ONEDEEP","PORKEY19","JUSTSMOKE420","BUGBUTT","TYRONEFISH","PADAANI","FIREFIGHTER256","DARKSTONER","BLACKJACK2020","DUCKIES45614","PLZENDME","GEROGETHEBOINK","ALEXANDERKORYHANSON","MEHIGH","DAVIDBARHAIM",
                "DUSKBUNNI","EDGELORD","ZOMBIE503","GEGARD","COREYWEB","CANDII420","0N3L0V3","FRYDADDY","KELLY92","FUCKTINYSHIT","BENNYBONES","JAKEOFMILLVILLE","URNOTGOODIMBAD","SWEETBUNNY","LITTYBITTY","RAZERDK","SURYA160","TRAINWILLIAMS",
                "LILPEENK","8E8PROBLEMZ","JUSTTIME2","BOBBYYOUNG","KKSLIDER","CONNORSJOHN","LILBUNNYFOOFOO","THESITTINGDUCK","METALMANIC","JONAHBENJAMIN","ARCANINE1","GHOSTWRITERX","X6SIX6X","KIVAMEES","VANILLARICE21","LIVILIIDID",
                "THEBILLIONAIREPOET","ICKLEPICKLE","DREWFY420","FRYDPOTATONUGGET","BUJUBANTON","CHADGUITARLOL","SPAMBOMB","SMOKEREGS","CUNTASAURUS1","BULLSSFTV","MEOWMIXERR","ELECTROJED","PABLOVONBREN","SONABANDIT","SCOOBY00741",
                "ALEXFROMWALMART","MEGASADGIRL","JESSKIRA","ALLACCESS","JURA","F4REIGNWAYS","JCLABOMB","NZMAORI","CRIPTREY","MENMY","TOPAZCHAPMAN","BBYBLEND598","6WOLFIE6","CYBERCESSPOOL","PENTAGRAMPETER","PROPHET","LZKI","YEMON",
                "WHYDOYOUDOTHIS","THEDOGCAT1234","KURAMA","ERICEDBERG","AKALUX","CHILLZONE","THEHOTBOXX","STAYGOLDENNIGGGG","A1UCARD","THEFERN","BATMAN1001","DMSCRATEDIGGIN","MEDICATED","HITHEREITSJUSTME","SMITHBOB123","KATLINCOMBS",
                "CITYKAN2","DAVEREBIRTH2","LEXINUGGET","JOEKERR","420LOU","TOKIE","THEPIGPEN"
            ],
            BGIMG: [
                "https://i.imgur.com/AIGX7Vv.jpg",
                "https://i.imgur.com/fFa0JNb.jpg",
                "https://i.imgur.com/y8NhrEw.jpg",
                "https://i.imgur.com/Jmj0NrT.jpg",
                "https://i.imgur.com/0d1UG6e.jpg",
                "https://i.imgur.com/w3QNrui.jpg",
                "https://i.imgur.com/4fV0Zl5.jpg",
                "https://i.imgur.com/SfhY2fK.jpg",
                "https://i.imgur.com/lhZ2OoW.jpg"
            ]
        };
        //EXECUTE FURTHER
        SlideShow();
        //FUNCTIONS
        function SlideShow() {
            console.log("runnn");
            BGCOUNT++;
            if (BGCOUNT === window.CTSAddon.BGIMG.length) BGCOUNT = 0;
            var BG = "url(\"" + window.CTSAddon.BGIMG[BGCOUNT] + "\") rgb(0, 0, 0) no-repeat";
            document.body.style.background = BG;
            setTimeout(SlideShow, 300000);
        }

    }
    /*
    ===========================================================================================
    ----------------------DO NOT MODIFY THE CODE BELOW THIS LINE-------------------------------
    ===========================================================================================
    */
    var e,
        i,
        //ERROR READOUTS
        error_code = [
            "Timeout",
            "Bad Code",
            "More Than One Addon Running",
            "Version Mismatch"
        ];
    var CTS = {
        Init: function() {
            e++;
            if(CTS.PageLoaded()) {
                try {
                    if (window.CTS === undefined) {
                        window.CTS = true;
                        CTS.Dispose();
                        if (CTS.Version()) {
                            // RUN
                            Main();
                        } else {
                            CTS.Flag(3, "ReqVersion:"+Project.RequiredVersion.Major+"."+Project.RequiredVersion.Minor+"."+Project.RequiredVersion.Patch+"\nCTSVersion:"+window.CTSVersion.Major+"."+window.CTSVersion.Minor+"."+window.CTSVersion.Patch);
                        }
                    } else {
                        CTS.Flag(2);
                    }
                } catch(e) {
                    CTS.Flag(1, e);
                }
                if(e >= 20) CTS.Flag(0);
            }
        },
        Load: function() {
            var val = localStorage.getItem("CTS_" + arguments[0]);
            if (null === val && "undefined" != typeof arguments[1]) {
                CTS.Save(arguments[0], arguments[1]);
                return arguments[1];
            }
            return val;
        },
        Save: function() {
            localStorage.setItem("CTS_" + arguments[0], arguments[1]);
        },
        PageLoaded: function() {
            if (document.querySelector("tinychat-webrtc-app")) {
                if (document.querySelector("tinychat-webrtc-app").shadowRoot) return true;
            }
        },
        Dispose: function() {
            clearInterval(i);
        },
        Version: function() {
            return ((Project.RequiredVersion.Major <= window.CTSVersion.Major && Project.RequiredVersion.Minor < window.CTSVersion.Minor) || (Project.RequiredVersion.Minor == window.CTSVersion.Minor && Project.RequiredVersion.Patch <= window.CTSVersion.Patch));
        },
        Flag: function(err, caught) {
            clearInterval(i);
            console.log("CTS ADDON ERROR\nCould not load!\nError: "+error_code[err]+ ((caught !== undefined)?"\n"+caught:"")+"\n\nProject Name:\n"+Project.Name);
        }
    };

    i = setInterval(CTS.Init, 500);
})();