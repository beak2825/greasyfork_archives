// ==UserScript==
// @name          TagPro SoundPacks
// @description   Change the default sounds with packs or individual files
// @author        Ko
// @version       2.0
// @icon          https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/speaker.png
// @match         *://*.koalabeast.com/*
// @match         *://*.jukejuice.com/*
// @match         *://*.newcompte.fr/*
// @require       https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/34785/TagPro%20SoundPacks.user.js
// @updateURL https://update.greasyfork.org/scripts/34785/TagPro%20SoundPacks.meta.js
// ==/UserScript==



    //-----------------------------------------------------------------------//
    //                                                                       //
    //       INCLUDED SOUNDPACKS:                                            //
    //           (choose one on a TagPro server's homepage)                  //
    //                                                                       //
    //           • minimal by Ko                                             //
    //                                                                       //
    //           • Cam's Sounds by Cam                                       //
    //               - source: https://redd.it/2iw5di                        //
    //                                                                       //
    //           • HarkMomis by RonSpawnsonTP                                //
    //               - source: https://redd.it/3fg1yb                        //
    //                                                                       //
    //           • Community Sounds by RonSpawnsonTP                         //
    //               - source: https://go.twitch.tv/ronspawnson/videos/all   //
    //                                                                       //
    //           • Animals by Ko                                             //
    //                                                                       //
    //           • A man's voice by Ko                                       //
    //                                                                       //
    //                                                                       //
    //        Go to: https://github.com/wilcooo/TagPro-SoundPacks            //
    //        for information on how to make your own SoundPack.             //
    //        No coding knowledge required, only creativity!                 //
    //                                                                       //
    //        Than message me (/u/Wilcooo) and I'll add your                 //
    //        SoundPack to this script :)                                    //
    //                                                                       //
    //-----------------------------------------------------------------------//




////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// Options have been moved to all TagPro servers homepages.                           //  //
//   (click on the green 'SoundPacks' button)                                         //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////







//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////






var short_name = 'soundpacks';          // An alphabetic (no spaces/numbers) distinctive name for the script.
tagpro.ready(function(){ if (!tagpro.scripts) tagpro.scripts = {}; tagpro.scripts[short_name]={version:GM_info.script.version,author:GM_info.script.author};});
console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');




// Ask me (/u/Wilcooo) to add your SoundPack to this list

const INCLUDED_SOUNDPACKS = {minimal   : 'https://raw.githubusercontent.com/wilcooo/TagPro-SoundPacks/master/SoundPacks/minimal.tpsp',
                             animals   : 'https://raw.githubusercontent.com/wilcooo/TagPro-SoundPacks/master/SoundPacks/animals.tpsp',
                             cam       : 'https://raw.githubusercontent.com/wilcooo/TagPro-SoundPacks/master/SoundPacks/cam.tpsp',
                             harkmomis : 'https://raw.githubusercontent.com/wilcooo/TagPro-SoundPacks/master/SoundPacks/harkmomis.tpsp',
                             community : 'https://raw.githubusercontent.com/wilcooo/TagPro-SoundPacks/master/SoundPacks/community.tpsp',
                             manvoice  : 'https://raw.githubusercontent.com/wilcooo/TagPro-SoundPacks/master/SoundPacks/manvoice.tpsp'};

const STANDARD_SOUNDS = ['burst', 'alert', 'cheering', 'drop', 'sigh', 'powerup', 'pop', 'click', 'explosion', 'countdown', 'friendlydrop', 'friendlyalert', 'alertlong', 'go', 'degreeup', 'teleport', 'wind', 'bing'];
const EXTRA_SOUNDS = ['allchat','teamchat','groupchat','system','mod','playerleft','playerjoined','playerswitched','afk','honk'];
const ALL_SOUNDS = STANDARD_SOUNDS.concat(EXTRA_SOUNDS);




var uploaded_sounds = GM_getValue('uploaded_sounds',{});






// =====SETTINGS=====

var settings = tpul.settings.addSettings( {
    'id': 'SoundPacks', // The id used for this instance of GM_config
    'title': 'SoundPacks options', // Panel Title
    'tooltipText': 'SoundPacks',
    'icon': 'https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/speaker.png',
    'fields': {
        'builtin': {
            'section': ['Choose SoundPacks',
                        'First, choose a built-in SoundPack, or leave blank for the default TagPro sounds.<br><br>If you want to keep things simple, this is the only option you will change.<br>A refresh is required for the settings to take effect!'], // Appears above the field
            'label': 'Built-in SoundPack', // Appears next to field
            'labelPos': 'left',
            'type': 'select', // Makes this setting a dropdown
            'options': [''].concat(Object.keys(INCLUDED_SOUNDPACKS)), // Possible choices
            'default': Object.keys(INCLUDED_SOUNDPACKS)[0], // Default value if user doesn't change it
            'title': 'Choose one of the built-in SoundPacks', // Add a tooltip (hover over text)
        },
        'packs_info': {
            'label': 'Load info on the built-in SoundPacks', // Appears next to field
            'type': 'button', // Makes this setting a dropdown
            'title': 'Name, author and description of every SoundPack', // Add a tooltip (hover over text)
            'click': function() {

                var packs_info = document.createElement('p');

                this.parentNode.replaceChild(packs_info, this);

                tagpro.scripts.soundpacks.included = INCLUDED_SOUNDPACKS;
                tagpro.scripts.soundpacks.packs_info = packs_info;

                for (var pack in INCLUDED_SOUNDPACKS) {

                    $.getJSON( INCLUDED_SOUNDPACKS[pack] )
                        .done( new Function('tpsp','(' + (function(pack){


                        var msg = '<a href=' + tagpro.scripts.soundpacks.included[pack] + ' target="_blank">' + pack + '</a>: ';


                        if ('name' in tpsp) {
                            msg += '<strong>' + tpsp.name + '</strong>';
                            if ('author' in tpsp) msg += " by " + tpsp.author;
                        } else if ('author' in tpsp) {
                            msg += 'a SoundPack by ' + tpsp.author; }
                        else msg += '???';

                        if ('description' in tpsp)
                            msg += '<br><em>' + tpsp.description + '</em>';

                        msg += '<br><br>';

                        tagpro.scripts.soundpacks.packs_info.innerHTML += msg;


                    }).toString() + ')("'+pack+'");'))

                        .fail( new Function('jqxhr', 'textStatus', 'error', '(' + (function(pack) {

                        tagpro.scripts.soundpacks.packs_info.innerHTML += '<a href=' + tagpro.scripts.soundpacks.included[pack] + ' target="_blank">' + pack + '</a>: This .tpsp file doesn\'t contain valid JSON. The SoundPack is unusable<br><br>' ;
                        var err_msg = textStatus + ", " + error;
                        console.error( "TP-SoundPacks: Requesting SoundPack failed. Are you sure that the URL in the script is a direct link to a valid .tpsp file?\n\n" + err_msg );
                    }).toString() + ')("'+pack+'");'));

                }
            },
        },
        'url': {
            'section': ['',
                        'Next, you can link to a .tpsp (TagPro SoundPack) file to overwrite some or all of the sounds from the SoundPack above. Click \'help\' to learn how to make your own pack that you can share with everyone.'], // Appears above the field
            'label': 'Direct link to a .tpsp (TagPro SoundPack) file.', // Appears next to field
            'labelPos': 'left',
            'type': 'text', // Makes this setting a dropdown
            'size': 50,
            'title': 'Type a valid URL here', // Add a tooltip (hover over text)
        },
        'upload': {
            'section': ['',
                        'And lastly, you can upload correctly named audio files (mp3, wav, ogg). Example: \'explosion.mp3\'. For a list of names you can use, click Help.'], // Appears above the field
            'label': 'Upload custom sound files', // Appears next to field
            'type': 'button', // Makes this setting a dropdown
            'title': 'Upload audio files (Multiple at a time)', // Add a tooltip (hover over text)
            'click': function() { // Function to call when button is clicked
                var this_btn = this;
                this_btn.type = 'file';
                this_btn.multiple = true;


                this_btn.onchange = function(event) {
                    this_btn.hidden = true;
                    var progress = document.createElement('progress');
                    this_btn.parentNode.insertBefore(progress, this_btn);

                    progress.max = 1;

                    for(var i = 0; i < this.files.length; i++) {
                        var name = this.files[i].name.toLowerCase();
                        var file_type = name.split('.').pop();
                        var sound = name.split('.')[0];
                        if (['wav','mp3','ogg'].indexOf(file_type) < 0) {
                            alert(name+' is not a .wav, .mp3 or .ogg file!');
                            continue;
                        }
                        if (ALL_SOUNDS.indexOf(sound) < 0) {
                            alert(sound+' is not one of the TagPro sound names. For a list, click Help.');
                            continue;
                        }
                        ++progress.max;
                        var reader = new FileReader();
                        reader.onloadend = function(n, r) {
                            uploaded_sounds[n] = r.result;
                            if(++progress.value == progress.max-1) {
                                tagpro.scripts.soundpacks.update_uploaded_list();
                                GM_setValue('uploaded_sounds', uploaded_sounds);
                                this_btn.parentNode.removeChild(progress);
                                this_btn.type = 'button';
                                this_btn.hidden = false;
                            }
                        }.bind(null, sound, reader);
                        reader.readAsDataURL(this.files[i]);
                    }

                    if (progress.max == 1) {
                        this_btn.parentNode.removeChild(progress);
                        this_btn.type = 'button';
                        this_btn.hidden = false;
                    }


                };


            },
        },
        'delete': {
            'label': 'Delete all uploaded sounds.', // Appears next to field
            'type': 'button', // Makes this setting a dropdown
            'click': function() { // Function to call when button is clicked
                uploaded_sounds = {};
                GM_deleteValue('uploaded_sounds');
                tagpro.scripts.soundpacks.update_uploaded_list();
            },
        },
        'Show_Credits_UI': {
            'section': ['Moar customization'], // Appears above the field
            'label': 'Show name and author above the timer', // Appears next to field
            'type': 'checkbox', // Makes this setting a checkbox
            'title': 'Show credits in the UI', // Add a tooltip (hover over text)
            'default': false,
        },
        'Show_Credits_Scoreboard': {
            'label': 'Show name and author on the scoreboard', // Appears next to field
            'type': 'checkbox', // Makes this setting a checkbox
            'title': 'Show credits on the scoreboard', // Add a tooltip (hover over text)
            'default': true,
        },
        'Show_Warnings': {
            'label': 'Show a warning in chat whenever a SoundPack has errors (warnings are always shown in the console)', // Appears next to field
            'type': 'checkbox', // Makes this setting a checkbox
            'title': 'Recommended: on', // Add a tooltip (hover over text)
            'default': true,
        },
        'help': {
            'section': ['Info',
                        'Author: Ko (/u/Wilcooo). For help, click the button below.'], // Appears above the field
            'label': 'Help & Info & Everything', // Appears next to field
            'type': 'button', // Makes this setting a button
            'title': 'Click me!', // Add a tooltip (hover over text)
            'click': function() { // Function to call when button is clicked
                window.open('https://github.com/wilcooo/TagPro-SoundPacks');
            },
        },
    },
    'events': {
        'open': function(doc){

            var uploaded_list = document.createElement('table');
            uploaded_list.border = 1;
            uploaded_list.rules = 'all';

            var delete_btn = settings.fields.delete.wrapper;
            delete_btn.parentNode.insertBefore(uploaded_list, delete_btn);

            tagpro.scripts.soundpacks.del_sound = function(sound){
                delete uploaded_sounds[sound];
                GM_setValue('uploaded_sounds',uploaded_sounds);
                update_uploaded_list();
            };

            tagpro.scripts.soundpacks.update_uploaded_list = update_uploaded_list = function() {
                uploaded_list.innerHTML = '';
                for (var snd in ALL_SOUNDS) {
                    var sound = ALL_SOUNDS[snd];
                    if (sound in uploaded_sounds) {
                        var row = document.createElement('tr');
                        row.innerHTML = "<td>"+sound+"</td><td><input type=button value='delete'></td>";

                        row.children[1].children[0].addEventListener('click', new Function('('+(function(sound){
                            tagpro.scripts.soundpacks.del_sound(sound);
                        }).toString()+')("'+sound+'")'));

                        uploaded_list.appendChild(row);

                        delete_btn.disabled=false;
                    }
                }

                if (uploaded_list.children.length === 0) {
                    uploaded_list.innerText = 'No sound files are uploaded';
                    delete_btn.disabled=true;
                }
            };
            update_uploaded_list();
        },
    },
});







if(tpul.playerLocation == 'game') {        // When in a game (there is a port number after the URL)

    var SoundPack = JSON.parse(GM_getValue('SoundPacks', '{"builtin":"' + Object.keys(INCLUDED_SOUNDPACKS)[0] + '"}')).builtin;
    var CustomPack = JSON.parse(GM_getValue('SoundPacks', '{}')).url;
    var Show_Credits_Scoreboard = JSON.parse(GM_getValue('SoundPacks', '{Show_Credits_Scoreboard: true}')).Show_Credits_Scoreboard;
    var Show_Credits_UI = JSON.parse(GM_getValue('SoundPacks', '{Show_Credits_UI: false}')).Show_Credits_UI;
    var Show_Warnings = JSON.parse(GM_getValue('SoundPacks', '{Show_Warnings: false}')).Show_Warnings;
    var extra = {};    // The extra sound elements will be stored in this object


    tagpro.ready(function () {

        var tpsp = {};


        // Modify the tagpro.playSound() function to adjust the volume per sound effect

        var tp_playSound = tagpro.playSound;

        tagpro.playSound = function(snd,vol=1) {

            if (tpsp.sounds && tpsp.sounds[snd] && 'volume' in tpsp.sounds[snd])
                if (0 <= vol && vol <= 1) {
                    vol *= tpsp.sounds[snd].volume;
                } else {
                    console.warn( "TP-SoundPacks: The volume for '"+snd+"' cannot be higher than 1. Please update your .tpsp file. Tip: mp3louder.com" );
                    if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: "The volume for '"+snd+"' cannot be higher than 1. Please update your .tpsp file. Tip: mp3louder.com", c: "#d1a140" });
                }

            tp_playSound(snd,vol);
        };





        var validURL = new RegExp('^(https?:\\/\\/)?'+ // protocol
                                  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
                                  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                                  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                                  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                                  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator


        if (SoundPack in INCLUDED_SOUNDPACKS)
            SoundPack_URL = INCLUDED_SOUNDPACKS[SoundPack];

        else if (validURL.test(SoundPack))
            SoundPack_URL = SoundPack;

        else if (SoundPack) {
            console.warn('TP-SoundPacks: no valid URL or name of an included soundpack');
            if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: 'No valid URL or SoundPack provided, please check the options of this script.', c: "#d1a140" });
            return;
        }










        if (SoundPack)        process_builtin(); // change_sounds() gets called by this function

        else if (CustomPack)  process_custom();  // change_sounds() gets called by this function

        else                { process_uploaded();   change_sounds(); }










        function process_builtin() {
            $.getJSON(SoundPack_URL)
                .done( function(data){

                tpsp = data;


                if (!tpsp.hasOwnProperty('sounds')) {
                    console.error( "TP-SoundPacks: The builtin SoundPack you selected has no 'sounds' tag! Blame Ko for implementing it :)" );
                    if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: "The selected builtin SoundPack has no 'sounds' tag! Blame Ko for implementing it :)", c: "#d1a140" });
                    return;
                }



                // add base to every URL, if the pack comes with one
                if ('base' in tpsp) {
                    Object.keys(tpsp.sounds).forEach( function(snd) {
                        tpsp.sounds[snd].source = tpsp.base + tpsp.sounds[snd].source;
                    });
                }


                tagpro.socket.emit('soundpacks',{tpsp : data});
                update_credits();

                if (CustomPack)  process_custom();  // change_sounds() gets called by this function

                else           { process_uploaded();   change_sounds(); }

            })
                .fail( function( jqxhr, textStatus, error ) {

                var err_msg = textStatus + ", " + error;
                console.warn( "TP-SoundPacks: Requesting the selected built-in SoundPack failed. Are you sure that the URL in the script is a direct link to a valid (correct JSON!) .tpsp file?\n\n" + err_msg );
                if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: 'The selected built-in SoundPack yields an error. Blame Ko for implementing it.', c: "#d1a140" });
            });
        }










        function process_custom() {
            $.getJSON(CustomPack)
                .done( function(data){


                var sounds = tpsp.sounds || {}; // Current sounds (from the selected built-in pack, or the default TagPro sounds)

                tpsp = Object.assign({}, data);
                tpsp.sounds = sounds;

                for (var sound in data.sounds) {
                    tpsp.sounds[sound] = data.sounds[sound];
                }

                // add base to every URL, if the pack comes with one
                if ('base' in tpsp) {
                    Object.keys(tpsp.sounds).forEach( function(snd) {
                        tpsp.sounds[snd].source = tpsp.base + tpsp.sounds[snd].source;
                    });
                }

                tagpro.socket.emit('soundpacks',{tpsp : tpsp});
                update_credits();


                process_uploaded(); change_sounds();

            })
                .fail( function( jqxhr, textStatus, error ) {

                var err_msg = textStatus + ", " + error;
                console.warn( "TP-SoundPacks: Requesting SoundPack failed. Are you sure that the URL in the script is a direct link to a valid (correct JSON!) .tpsp file?\n\n" + err_msg );
                if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: 'The provided URL did not work, you made a typo, or the .tpsp file is not valid JSON. Please look at the options of this script', c: "#d1a140" });
            });
        }



        function process_uploaded() {

            Object.keys(uploaded_sounds).forEach( function(snd) {
                if (ALL_SOUNDS.indexOf(snd) > -1)
                    tpsp.sounds[snd] = { source : uploaded_sounds[snd] };
                else {
                    console.warn( "TP-SoundPacks: Something went horribly wrong. Please inform Ko and remember error-code 'penguin'" );
                    if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: "'"+snd+"' is not a valid soundname. How da fuck did you upload it? This message should never be visible. Please inform Ko, because something went terribly wrong.", c: "#d1a140" });
                }
            });


        }








        function change_sounds() {

            // This function is c̶o̶p̶i̶e̶d̶ ̶f̶r̶o̶m̶ inspired by https://pastebin.com/raw/21NYcZ58.
            // Thanks to whoever of these made it; RonSpawnson, Cyanide, Seconskin, Cam and Acid Rap

            for (var snd in tpsp.sounds) {
                if (tpsp.sounds.hasOwnProperty(snd)) {
                    if (STANDARD_SOUNDS.indexOf(snd) > -1) {

                        // Remove all audio sources for sound except the first
                        $('audio#' + snd).find('source:gt(0)').remove();

                        // Replace the first audio source with the new sound
                        $('audio#' + snd).find('source').attr('src', tpsp.sounds[snd].source);

                        // Reload the sound with the new source
                        $('audio#' + snd)[0].load();
                    } else if (EXTRA_SOUNDS.indexOf(snd) > -1) {

                        // Make a new audio
                        extra[snd] = new Audio(tpsp.sounds[snd].source);

                        // Make sure it's loaded (not necessary, but better save than sorry)
                        extra[snd].load();
                    } else {
                        console.warn( "TP-SoundPacks: '"+snd+"' is not a valid soundname. Please update your .tpsp file" );
                        if (Show_Warnings) tagpro.socket.emit("local:chat", { to: "all", from: "TP-SoundPacks", message: "'"+snd+"' is not a valid soundname. Please update your .tpsp file", c: "#d1a140" });
                    }
                }
            }


            // Listen for events that should trigger the extra sounds

            if ( ['allchat','teamchat','groupchat','system','mod','playerleft','playerjoined','playerswitched'].some(snd => extra[snd]) ) {
                // (this means: if any of these listed sounds is in the 'extra' object)

                tagpro.socket.on('chat', function(chat){

                    var audio;

                    if ( chat.mod || chat.to == 'ADMIN_GLOBAL_BROADCAST') {   // Message is sent by a mod or admin
                        audio = extra.mod || extra.system || extra.allchat;
                    }

                    else if ( typeof chat.from == 'number' ) {   // Message is sent by a player in your game
                        if ( chat.to == 'all' )
                            audio = extra.allchat;

                        else if ( chat.to == 'team' )
                            audio = extra.teamchat || extra.allchat;

                        else if ( chat.to == 'group' )
                            audio = extra.groupchat || extra.allchat;

                        // This should never be the case:
                        else audio = extra.system || extra.allchat;
                    }

                    else if ( chat.message.includes('has left the') )
                        audio = extra.playerleft || extra.system || extra.allchat;

                    else if ( chat.message.includes('has joined the') )
                        audio = extra.playerjoined || extra.system || extra.allchat;

                    else if ( chat.message.includes('has switched to the') )
                        audio = extra.playerswitched || extra.system || extra.allchat;

                    else audio = extra.system || extra.allchat;


                    if (audio) audio.play();
                });

                tagpro.group.socket.on('chat', function(chat){

                    var audio;

                    if ( chat.from )   // If the message is send by someone in your group
                        audio = extra.groupchat || extra.allchat;

                    else if ( chat.message.includes('has left the group') )
                        audio = audio = extra.playerleft || extra.system || extra.allchat;

                    else if ( chat.message.includes('has joined the group') )
                        audio = audio = extra.playerjoined || extra.system || extra.allchat;

                    else if ( chat.message.includes('has been kicked from the group') )
                        audio = audio = extra.playerleft || extra.system || extra.allchat;

                    // This has never been observed:
                    else audio = extra.system || extra.allchat;


                    if (audio) audio.play();
                });
            }

            if ( extra.afk ) {

                console.warn( "TP-SoundPacks: 'afk' is not yet implemented" );
            }

            if ( extra.honk ) {

                console.warn( "TP-SoundPacks: 'honk' is not yet implemented, install the honk script if you want that functionality!" );
            }

        }





        function update_credits () {

            var msg;
            if ('name' in tpsp) {
                msg = "SoundPack: " + tpsp.name;
                if ('author' in tpsp) msg += " by " + tpsp.author;
            } else if ('author' in tpsp) {
                msg = "SoundPack by " + tpsp.author; }
            else msg = "SoundPack unnamed";

            if (Show_Credits_Scoreboard) {
                // This shows it on the scoreboard (beneath the mapname & songname)

                var musicInfo = document.getElementById('musicInfo');

                var SoundPackInfo = musicInfo.cloneNode();
                SoundPackInfo.id = 'SoundPackInfo';
                SoundPackInfo.classList.remove('hide');
                SoundPackInfo.innerText = msg;

                musicInfo.parentNode.insertBefore( SoundPackInfo, musicInfo.nextSibling );

            }

            if (Show_Credits_UI) {
                // And this shows the credits above the timer.

                var style1 = { fontFamily:"Arial", fontSize:10, fontStyle:"bold", fill:"#999999", dropShadow:true, dropShadowDistance:1 };
                var style2 = {"dropShadow": true, "dropShadowAlpha": 0.3, "dropShadowAngle": 0, "dropShadowBlur": 1, "dropShadowDistance": 0, "letterSpacing": 1.1, "lineJoin": "round", "fill": "#ffffff", "fontSize": 11, "fontWeight": 600, "stroke": "#252525", "strokeThickness": 2 };

                var credit = new PIXI.Text(msg, style2);


                credit.anchor.x = 0.5;
                credit.x = ($("#viewport").width() / 2);
                credit.y = $("#viewport").height() - 3;
                credit.alpha = 0.9;

                tagpro.ui.sprites.SoundPackCredit = new PIXI.Container();

                tagpro.renderer.layers.ui.addChild(tagpro.ui.sprites.SoundPackCredit);
                tagpro.ui.sprites.SoundPackCredit.addChild(credit);


                var org_resize = tagpro.renderer.resizeAndCenterView;

                tagpro.renderer.resizeAndCenterView = function() {
                    credit.x = ($("#viewport").width() / 2);
                    credit.y = $("#viewport").height() - 54;
                    org_resize();
                };

            }

        }








    });
}