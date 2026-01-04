// ==UserScript==
// @name Music Player
// @namespace http://tampermonkey.net/
// @version 0.1
// @license Apache License 2.0
// @description Displays a button labeled "Songs" that opens a window with play buttons for different songs. Each song can be played individually with pause, stop, and volume adjustment functionalities.
// @match https://*/*
// @match http://*/*
// @icon https://cdn.dribbble.com/users/747620/screenshots/5451284/glitch_text.gif
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491174/Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/491174/Music%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let musicPlayerWindow = null; // Track the music player window

    // Create the button
    const songsButton = document.createElement('button');
    songsButton.textContent = 'Songs';
    songsButton.style.backgroundColor = 'black';
    songsButton.style.color = 'white';
    songsButton.style.position = 'fixed';
    songsButton.style.top = '32.5%';
    songsButton.style.left = '20px';
    songsButton.style.zIndex = '9999';
    songsButton.addEventListener('click', openMusicPlayer);
    document.body.appendChild(songsButton);

    // Function to open the music player window
    function openMusicPlayer() {
        if (musicPlayerWindow && !musicPlayerWindow.closed) {
            musicPlayerWindow.focus(); // If window is already open, focus on it
            return;
        }

        musicPlayerWindow = window.open('', '_blank', 'width=400,height=300,top=100,left=100');
        musicPlayerWindow.document.title = 'Playlist'; // Set window title to "Playlist"
        musicPlayerWindow.document.body.style.backgroundColor = 'black'; // Set background color to black

        // Disable closing the window
        musicPlayerWindow.addEventListener('beforeunload', function(event) {
            event.preventDefault();
            event.returnValue = '';
        });

        // Create a div for the title
        const titleDiv = document.createElement('div');
        titleDiv.textContent = 'Playlist';
        titleDiv.style.color = 'white'; // White text
        titleDiv.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
        titleDiv.style.fontSize = '36px'; // Larger font size
        titleDiv.style.fontWeight = 'bold'; // Bold font
        titleDiv.style.textAlign = 'center'; // Center-align text
        titleDiv.style.marginTop = '20px'; // Add margin from the top
        musicPlayerWindow.document.body.appendChild(titleDiv);

        // Create audio elements for each song
        const songs = [
            { name: 'After Dark', url: 'https://drive.google.com/uc?export=download&id=1YBpNKw-Sl6wTclJ4mliXYaSrK1ldTr1P' },
            { name: 'Sonic.exe music', url: 'https://drive.google.com/uc?export=download&id=1Xx5r3d7LmDk8hVkSvf6-WMOnxJRvjO23' },
            { name: 'PATD Emperor\'s New Clothes', url: 'https://drive.google.com/uc?export=download&id=1Yew0YY5Iwdm4VbjjxkjWBI4qtpn-lR-I' },
            { name: 'PATD This Is Gospel', url: 'https://drive.google.com/uc?export=download&id=1YnG5miZNCQMu5S0BC5y6iMThVBz7Z26P' },
            { name: 'PATD Death of a Bachelor', url: 'https://drive.google.com/uc?export=download&id=1Ys1s4z-ClOnb8T3BDvnO-CE9_PouHHr1' },
            // RED songs
            { name: 'RED Part that\'s holding on', url: 'https://drive.google.com/uc?export=download&id=1Yz9bjVO98c2F-kIU3iUpRGRWbw7aZuFn' },
            { name: 'RED Falling sky', url: 'https://drive.google.com/uc?export=download&id=1ZDvKvs2PucLdsIkVFRl-KgXtZqn4zbtO' },
            { name: 'RED What you keep alive', url: 'https://drive.google.com/uc?export=download&id=1ZH22WharprXcc0gz4jJuK89W6-RTHCLo' },
            { name: 'RED Losing control', url: 'https://drive.google.com/uc?export=download&id=1ZJ7mtXWoDvQ1H1GDi7moNfsw18VhwEth' },
            { name: 'RED If I break', url: 'https://drive.google.com/uc?export=download&id=1ZOu0CpUygSRf4nSAZ3Lgj7gl0v4gr5Q-' },
            { name: 'RED Yours again', url: 'https://drive.google.com/uc?export=download&id=1ZRiAKf_Z9jI3o9fqU1fprMPNLUiyKPjj' },
            { name: 'RED ~Darkest Part~', url: 'https://drive.google.com/uc?export=download&id=1ZWXPIR422spsYN-zveVePC4DttoHldr6' },
            { name: 'RED Still alive', url: 'https://drive.google.com/uc?export=download&id=1ZZzVEtK97eFFz-eW2A65SuvpeFpuD5In' },
            { name: 'RED Coming apart', url: 'https://drive.google.com/uc?export=download&id=1Z_3b5QdrWjqkQXP4TJBVVAoJqtwBKds7' },
            { name: 'RED As you go', url: 'https://drive.google.com/uc?export=download&id=1ZbJRxKSys2_4_S985XG6K0K6xyf2Dof1' },
            { name: 'RED Hold me now', url: 'https://drive.google.com/uc?export=download&id=1ZdcjjsUMDSydQBzr1YD7JPxaY5ryumZ9' },
            { name: 'RED Death of me', url: 'https://drive.google.com/uc?export=download&id=1Zf18ekSaxJ6shtmMxY0-QSj6YlL0GNxA' },
            { name: 'RED Fight to forget', url: 'https://drive.google.com/uc?export=download&id=1ZgzE8BpU7SRFzDKRchfMlzzBilUNQNMV' },
            // End of RED songs
            { name: 'Sub Urban CRADLES', url: 'https://drive.google.com/uc?export=download&id=1Zit2CuvdwRrBK4rqjlIu9QwgCESEAaXG' },
            { name: 'SWEET SWEET VICTORY', url: 'https://drive.google.com/uc?export=download&id=1Zj4L6Red0a3sTAaQ0_X1QqXP3TwhdvCW' },
            { name: 'Astronomia', url: 'https://drive.google.com/uc?export=download&id=1Znxa2Jz7nEigFY2U1XOmXm0czSsWWcgA' },
            { name: 'Afrojack Ten Feet Tall', url: 'https://drive.google.com/uc?export=download&id=1Zrz9Z4qXbLFDlXU2SdaN1k3O15TrqDi-' },
            { name: 'FOB The Phoenix', url: 'https://drive.google.com/uc?export=download&id=1ZyxjFK4sGg_NYbNHOgnpNukHTUKkFlNU' },
            { name: 'FOB Light \'Em Up', url: 'https://drive.google.com/uc?export=download&id=1ZyzJJPWRqDYr3Izp81jWZfPxAVCU8x7f' },
            { name: 'FOB Uma Thurman', url: 'https://drive.google.com/uc?export=download&id=1ZzEFkeX7nBrN2loIjtN4idiVPHQHCHp3' },
            { name: 'FOB Centuries', url: 'https://drive.google.com/uc?export=download&id=1_0OfS0HfG5RkZCvmj48DzK92sQHFf2Gn' },
            { name: 'FOB Irresistible', url: 'https://drive.google.com/uc?export=download&id=1_0wu35Giy_94sT5CBU4nbsWv-YTVMp5Z' },
            { name: 'FOB Immortals', url: 'https://drive.google.com/uc?export=download&id=1_6OcWd4YqPh3o-CSkxpnJ1ErusfIvRSW' },
            { name: 'FOB Alone Together', url: 'https://drive.google.com/uc?export=download&id=1_AFCk-GYJXgafPUyJPI5q5_rK3alQ3DV' },
            { name: '24KGoldn Mood', url: 'https://drive.google.com/uc?export=download&id=1_FGlouBMJAZ5sRKMGrabYIP-baGeTwgZ'},
            { name: 'FRIENDS Marshmello & Anne-Marie', url: 'https://drive.google.com/uc?export=download&id=1_JBfwobslMwFApDylqh6_1M6t4ixYbb5' },
            { name: 'Feel This Moment Pitbull', url: 'https://drive.google.com/uc?export=download&id=1_RmyXuwWGc5G0-J20QwE1xopbta2_zep' },
            { name: 'Without me - Halsey', url: 'https://drive.google.com/uc?export=download&id=1_cA5-7LaGMFwXjsp-SmHtqyNuaXsTTAn' },
            { name: 'Party Rock', url: 'https://drive.google.com/uc?export=download&id=1_d-Zb7TACWKVCPxplOjP867ObGFbgXXr' },
            { name: 'Come & go - marsh. x juice.', url: 'https://drive.google.com/uc?export=download&id=1_dLkstzsbFWTlse5Z3EGzUr07YvNF5k9' },
            { name: 'Work - Apashe', url: 'https://drive.google.com/uc?export=download&id=1_daovBcjhYa6bMzCvO3IGqN1p0FME3l_' },
            { name: 'Mr Kitty After Dark TrackGonEat Remix', url: 'https://drive.google.com/uc?export=download&id=1_hztVjtLM_XnJJFkAKi3slQCrkxJn92Z' },
            { name: 'DJ Tiesto Remix KRAKEN REMIX', url: 'https://drive.google.com/uc?export=download&id=1_l20NFJIR7WhyFvOeGuxuTvVqfax_1sm' },
            { name: 'No Hands - Roscoe Dash', url: 'https://drive.google.com/uc?export=download&id=1_ta1L0DhdRMJhj0avlZd48e0qBgqAVWE' },
            { name: 'Runaway (U and I)', url: 'https://drive.google.com/ucexport=download&id=1aA5VXujpOTX_glzkctaGUyYo2JsuWhX0' },
            { name: 'Scared Of The Dark (MM)', url: 'https://drive.google.com/uc?export=download&id=1_v8vERcj3KL7nWwoMZTrkZ7q6YeNfrOE' },
            { name: 'Start A Riot (MM)', url: 'https://drive.google.com/uc?export=download&id=1_wCG_u-Rsux4TI9oLbNE-N66jxUteEal' },
            { name: 'What\'s up Danger (MM)', url: 'https://drive.google.com/uc?export=download&id=1a-f7KjMsQ7Tp7OTy6dPspe1aGA7Dv2Ik' },
            { name: 'Elevate (MM)', url: 'https://drive.google.com/uc?export=download&id=1a53C0Lb6p5wjND4PiyUbVi0-CzZ7YU5E' },
            { name: 'Galantis Runaway', url: 'https://drive.google.com/uc?export=download&id=1aA5VXujpOTX_glzkctaGUyYo2JsuWhX0' },
            { name: 'BT Rusted from the rain', url: 'https://drive.google.com/uc?export=download&id=1aB-I7gPgLxcR1Q5LCQzoK3CLwdkhXPED' },
            { name: 'BT Try Honesty', url: 'https://drive.google.com/uc?export=download&id=1aBnawTgK_Lg19zmW-Bju5IPwLoY_ZfWB' },
            { name: 'BT Fallen Leaves', url: 'https://drive.google.com/uc?export=download&id=1aBu9fBeSnDLTY5xwME__D0QnS4eoOyPZ' },
            { name: 'BT Devil in a midnight mass', url: 'https://drive.google.com/uc?export=download&id=1aESu4iUvwg9lqQ5JQ2n5RJFGW9uwAfGq' },
            { name: 'BT Devil on my shoulder', url: 'https://drive.google.com/uc?export=download&id=1aFOsoDXSV_5zU0vFObU4jlpJ0LuZovlG' },
            { name: 'GS Sarcasm', url: 'https://drive.google.com/uc?export=download&id=1aOnfPaeiTc5XeIFonlKd381-RuMkorZQ' },
            { name: 'GS Keep Myself Alive', url: 'https://drive.google.com/uc?export=download&id=1aQ0lTuY3wiZlPNeVfvUxf40yt3Kwb7hq' },
            { name: 'GS Don\' you dare forget the sun', url: 'https://drive.google.com/uc?export=download&id=1aR-z5y1srqYUV3RBHJvW1De9nEzZpwsb' },
            { name: 'GS Problematic', url: 'https://drive.google.com/uc?export=download&id=1aTmv2ExwMr3vsVGv_9G2ynTuiAmoMEZ0' },
            { name: 'GS Built for blame', url: 'https://drive.google.com/uc?export=download&id=1aUrABLtmdf7AG_BIDeLY6JfXURhWa5Ti' },
            { name: 'GS Buried Alive', url: 'https://drive.google.com/uc?export=download&id=1aWj-KvLyMmI-H8LBc4UuYEIRXl9nhpyR' },
            { name: 'GS Suffer', url: 'https://drive.google.com/uc?export=download&id=1aX1-Va3hpzwC3o0Zi-JQWBS9WKEkBReS' },
            { name: 'GS Under My Skin', url: 'https://drive.google.com/uc?export=download&id=1aZXuSw-n9RnBQDpzJp8K9AWJ1ZtvzLH2' },
            { name: 'GS Relax, Relapse', url: 'https://drive.google.com/uc?export=download&id=1ag6CBX_PCjB15pfqX0dVRtr17DqnV5tJ' },
            { name: 'GS Second Guessing', url: 'https://drive.google.com/uc?export=download&id=1ahC6dfouvNPnC9XNgC3Lv9zwIeD8nXEo' },
            { name: 'GS Voodoo', url: 'https://drive.google.com/uc?export=download&id=1at0eLRyuSXOFWKYN6FmYhNVcmKMLgbHL' },
            { name: 'GS The Dead Days', url: 'https://drive.google.com/uc?export=download&id=1aulA1xem_c1b-UihGxcKP01FbVWHvNCs' },
            { name: 'GS Silence', url: 'https://drive.google.com/uc?export=download&id=1avA0g-2Lyz1O7Jto5HArIVZ7i9C68xO9' },
            { name: 'GS Dance with the dead', url: 'https://drive.google.com/uc?export=download&id=1axbGe4pjLB9XqrVjbWczCWnVscAFJ8Tp' },
            { name: 'GS Goodbye Soul', url: 'https://drive.google.com/uc?export=download&id=1b-BIOaCcEA6bPpPfu-s_O3CKVaSGTJAf' },
            { name: 'Silva Hound HAZBIN HOTEL - Addict', url: 'https://drive.google.com/uc?export=download&id=1b0rkk0RQa2UKdrlCRX3Y6Yn0ilJIliSr' },
            { name: 'PLAY WITH ME (Sonic.EXE)', url: 'https://drive.google.com/uc?export=download&id=1b1Kj5Cfdj9ncM3MD944SG2VbTgapi5la' },
            { name: 'Dark Auras (slowed reverb)', url: 'https://drive.google.com/uc?export=download&id=1b4PMV5tBBVZ4jRJfJM04gh2FhotPDIx9' },
            { name: 'TLT FNAF this comes from inside', url: 'https://drive.google.com/uc?export=download&id=1bAj3BvM5dBl5YgY90akVHfYwtUAPpWbN' },
            { name: 'CG5 Sleep Well', url: 'https://drive.google.com/uc?export=download&id=1bEdEU5wv70Mn3Vp0Yhz9CLuFa15bhuDr' },
            { name: 'Wide Awake ', url: 'https://drive.google.com/uc?export=download&id=1bEx7y2vlAESN8_mVVLU-n9icvUJt2A9V' },
            { name: 'I Can\'t fix you apAngryPig', url: 'https://drive.google.com/uc?export=download&id=1bHiTpsVFeI4MaZrn3V2IQs-no-0wK-wN' },
            { name: 'CG5 Stuck Inside Green Skeleton Remix', url: 'https://drive.google.com/uc?export=download&id=1bJ0GQlMveFaF42jr4n5enxWEIBq3tsXO' },
            { name: 'CG5 Skibidi Toilet', url: 'https://drive.google.com/uc?export=download&id=1bKbltVDTRW3DiksAd7hc22bN9mUl69Ws' },
            { name: 'Undertale MEGALOVANIA', url: 'https://drive.google.com/uc?export=download&id=1bQwg81qwWGiqf3k0XyDLCwIchVtnUVSe' },
            { name: 'ULTRA NECROZMA METAL COVER', url: 'https://drive.google.com/uc?export=download&id=1bSj9SebtRW_e2hW6kPSBqA_4_JYep8dA' },
            { name: 'Triple Trouble METAL COVER', url: 'https://drive.google.com/uc?export=download&id=1bTftX_1nGemNXKwHBQwdokUiHscj3Wui' },
            { name: 'Undefeatable (Sonic Frontiers) METAL COVER', url: 'https://drive.google.com/uc?export=download&id=1bVAdaZs5jFKASYvP8lgLAm5vkaLHONcz' },
            { name: 'DaGames Build Our Machine Metal Cover', url: 'https://drive.google.com/uc?export=download&id=1bVBdjMlWYIm6HQFfH0u29jXmlAOe5-D9' },
            { name: 'Discharge Metal Cover', url: 'https://drive.google.com/uc?export=download&id=1bYthKz-OKsYO5WWNTs-X34IfeGR8xERl' },
            { name: 'DHeusta Dark Deception TipToe', url: 'https://drive.google.com/uc?export=download&id=1b_z1DyiniLFxoeddgZ6AifYY6UKXcFmz' },
            { name: 'DHeusta FNAF Into the pit', url: 'https://drive.google.com/uc?export=download&id=1bbLBU06psNC7_kF3ckYZUqYrI3aVg3GR' },
            { name: 'Into the pit remix cover', url: 'https://drive.google.com/uc?export=download&id=1bgQMKshtZ1MPbn0gFoNIajOKXT5H1DsJ' },
            { name: 'TLT It\'s been so long', url: 'https://drive.google.com/uc?export=download&id=1biBgd_6Gg3_f2v3k-kaIeV5OxWPoYl7S' },
            { name: 'TLT FNAF Original Song', url: 'https://drive.google.com/uc?export=download&id=1bq4f9Zl9nKpEwe5ew2IxK0SLFV81zVNB' },
            { name: 'CG5 Phantom Dancing', url: 'https://drive.google.com/uc?export=download&id=1btLUUS_9qf-N-44JgYu3Jg94Z_m0Mepu' },
            { name: 'CG5 Lyin 2 Me', url: 'https://drive.google.com/uc?export=download&id=1bzJJZpfBFWWMs1Z1xc_quo2Q69-0XhHt' },
            { name: 'CG5 FNAF 4 remix ft. TLT', url: 'https://drive.google.com/uc?export=download&id=1c-bQdphYrR1Lz2kVLQrKpONAy9Mx7qP3' },
            { name: 'CG5 good to be alive', url: 'https://drive.google.com/uc?export=download&id=1c0bnZ7oeCjWmbj64IuQ1-CbTXP28YJcV' },
            { name: 'CG5 SHow Yourself', url: 'https://drive.google.com/uc?export=download&id=1c1C3ae25I4Jzt1Wir5axsur_AtJk4Bdi' },
            { name: 'CG5 Every Door', url: 'https://drive.google.com/uc?export=download&id=1c3uH7RPqIxYHW3hNtIMcg1echMcAxZXh' },
            { name: 'CG5 Poison Blooms', url: 'https://drive.google.com/uc?export=download&id=1cCXgU6PuRPYQgeKVSbwQ8K6J6b1xVxdc' },
            { name: 'CG5 Toon Catasrophes', url: 'https://drive.google.com/uc?export=download&id=1cFNZmqVtBenDnREf-8bRPDIR5ASOW5RU' },
            { name: 'CG5 He\'s the cartoon cat', url: 'https://drive.google.com/uc?export=download&id=1cF_Pu3I9q9gZRNWqUiIen00xXqGXK_Aj' },
            { name: 'CG5 Let me through', url: 'https://drive.google.com/uc?export=download&id=1cHf5sVf2lT2QdoIeNobJYTViFDuN111h' },
            { name: 'CG5 Mommy\'s here', url: 'https://drive.google.com/uc?export=download&id=1cL6W_NuJ9weuS_m1znfIoPvM4vA9IJmW' },
            { name: 'CG5 Bred To Be Bad', url: 'https://drive.google.com/uc?export=download&id=1cP4P4I8ghD6rJHo-EatRTBDz8QPOg3ru' },
            { name: 'CG5 MINION', url: 'https://drive.google.com/uc?export=download&id=1cSGVb5lP0GupNuCSmyH9hkv0-qjvm30Z' },
            { name: 'CG5 Glamorous', url: 'https://drive.google.com/uc?export=download&id=1cTbzblrw9SlgAvz6EC32sgzBbKqXaG6U' },
            { name: 'CG5 Pied Piper', url: 'https://drive.google.com/uc?export=download&id=1cXvwko-gu32Q1CYTgnYfZ6r4GZ8n9-QD' },
            { name: 'CG5 IDONTUNDERSTAND', url: 'https://drive.google.com/uc?export=download&id=1ccQJhbD9THua0Bilb6aFSeoJNcmmeATL' },
            { name: 'RG Memory', url: 'https://drive.google.com/uc?export=download&id=1coyyN9Aiif48wDN6KCnU3ecLFAMpHAIQ' },
            { name: 'RG TIME Stranger Things', url: 'https://drive.google.com/uc?export=download&id=1cp5Broybctm9EBFkPUgMfQ6PUd1vVGvv' },
            { name: 'RG PURPLE', url: 'https://drive.google.com/uc?export=download&id=1czQ3mgculd1E68ZH_sNa5fIKNEIeojYa' },
            { name: 'RG ORANGE', url: 'https://drive.google.com/uc?export=download&id=1d-HLXtZLLeJPT88_qDUKdk7yXZRIB51X' },
            { name: 'SOLO "Let me solo her"', url: 'https://drive.google.com/uc?export=download&id=1d-fOdQuSIY7kaqERHkREgkqbltdz0Ggi' },
            { name: 'JT Music Monsters FNAF', url: 'https://drive.google.com/uc?export=download&id=1d38GNGDOIoJo_Q9ynZnNUEMd9y1RCAGd' },
            { name: 'JT Music AMANDA THE ADVENTURER', url: 'https://drive.google.com/uc?export=download&id=1d4EWchBidy8ro2yKVlNEfyY5vW7fBM32' },
            { name: 'Shwab Straight Up', url: 'https://drive.google.com/uc?export=download&id=1d6FNz0Z1DsRkf_BCclsBuW1DPe_iTIHt' },
            { name: 'Shwab Untouchable', url: 'https://drive.google.com/uc?export=download&id=1d8HMFWXn7i2JVcJkFjOs-Q_TeDqxUrSj' },
            { name: 'Shwab I Want Violence', url: 'https://drive.google.com/uc?export=download&id=1dB5F5itvINrbSevUvCo_ZiH_pNi4YPZr' },
            { name: 'Dizzy Sacrifices', url: 'https://drive.google.com/uc?export=download&id=1dE5KqUjHKyGJGMP5ZX9CAhzGJgFHhKNi' },
            { name: 'Dizzy Slide', url: 'https://drive.google.com/uc?export=download&id=1dELTWli6fbbIfw_ZIzl4po_KCJJoaU6N' },
            { name: 'Dizzy Sharingan', url: 'https://drive.google.com/uc?export=download&id=1dI30ujDQxLhoEE7iivFdCabUuEmA-wyC' },
            { name: 'Dizzy In Paradis', url: 'https://drive.google.com/uc?export=download&id=1dR3QZu504DOPasOzxOSWKlsela3Y-bmW' },
            { name: 'Dizzy No Way Home', url: 'https://drive.google.com/uc?export=download&id=1dXC8YdV-9i-kh_ksu9EYEZBapfFiL4mX' },
            { name: 'Dizzy I Don\'t wanna be alone', url: 'https://drive.google.com/uc?export=download&id=1dZ0u61QOku71NeheUyn1Bjniz9HLS-JL' },
            { name: 'Dizzy Gojo_Flow', url: 'https://drive.google.com/uc?export=download&id=1dZRWWnK6-p69HSypAqpUfY3XPgb5vLED' },
            { name: 'Dizzy Invincible', url: 'https://drive.google.com/uc?export=download&id=1dfIna9mziktBvVT6vn013x5rjawG-AaA' },
            { name: 'Dizzy Fire In My Heart', url: 'https://drive.google.com/uc?export=download&id=1dfUGfl380Z5oqY5-ruJIatpC_3Je2e9h' },
            { name: 'Dizzy Cold Flame', url: 'https://drive.google.com/uc?export=download&id=1diXpbQla5M1jtU6alIGBkCFZzcIVTz__' },
            { name: 'Dizzy Off My Mind', url: 'https://drive.google.com/uc?export=download&id=1dpRJlXZL4AhgqGYJrr5fa8ni8gc8p914' },
            { name: 'Dizzy Royalty', url: 'https://drive.google.com/uc?export=download&id=1dsrnc_taRx6ElVOBG_q6bOrRzq-4Tlh0' },
            { name: 'Dizzy Crazy In Love', url: 'https://drive.google.com/uc?export=download&id=1dv1xRdVces-jUd6veWvSTjhZNhG0v65R' },
            { name: 'Dizzy KAKAROT', url: 'https://drive.google.com/uc?export=download&id=1dv8GNFKUCiX3wvAL3A5m0jCnnG7Ro3_-' },
            { name: 'Dizzy Redemption', url: 'https://drive.google.com/uc?export=download&id=1e1NFhigDWWgNmanT8WbSQw-_2Gq1UYlg' },
            { name: 'Dizzy Itachi', url: 'https://drive.google.com/uc?export=download&id=1e779Z3uNMxkxFHi_I22kj7soqbhpOVmW' },
            { name: 'Dizzy ULTRA INSTINCT FREESTYLE', ur: 'https://drive.google.com/uc?export=download&id=1e7xNPDO744vfyaiq3NgtIc28NG_G-FuN' },
            { name: 'Dizzy Decay', url: 'https://drive.google.com/uc?export=download&id=1e843is3kI8t4_XZUezXmLWJ1Yai2be-m' },
            { name: 'Dizzy Feeling Like', url: 'https://drive.google.com/uc?export=download&id=1e9E4Tgtg9IzkG0TkWs1WB_vhwV8bcdmX' },
            { name: 'Dizzy DEATH MATCH', url: 'https://drive.google.com/uc?export=download&id=1eISHh4w9tH50PnFwraqBkgmMEdUQvR-_' },
            { name: 'Dizzy MARINES CYPHER', url: 'https://drive.google.com/uc?export=download&id=1eLoGVY6jLnjAwWgKp2c-33GsguaNUrMR' },
            { name: 'Dizzy Shooting Star', url: 'https://drive.google.com/uc?export=download&id=1eM4__j6ZLT6xNqqCZmllRtOGme2cXT_F' },
            { name: 'Dizzy Eclipse', url: 'https://drive.google.com/uc?export=download&id=1eMUjWlPMcw-YECp4am-_zmplJ1vArJ7K' },
            { name: 'Dizzy Arch-Villain', url: 'https://drive.google.com/uc?export=download&id=1eO2uq3mRJsJLlUiw6WHQCc6LEGD4N3Ls' },
            { name: 'Dizzy Not Mine', url: 'https://drive.google.com/uc?export=download&id=1ePe2NeWKL0Qljt5b9uATqm1HPDTtSdwr' },
            { name: 'Dizzy Liberation', url: 'https://drive.google.com/uc?export=download&id=1eQzdFLgOWMso-7N_Pm2o0hoJe2CMegqx' },
            { name: 'Dizzy Reckless', url: 'https://drive.google.com/uc?export=download&id=1eTSibM7cd9mPMKiqQYV9zCYo3zF_quAP' },
            { name: 'Dizzy RATIO', url: 'https://drive.google.com/uc?export=download&id=1eh8IncOq3HoO5OPQVTT5zYEksCDXlWdz' },
            { name: 'Dizzy Strongest', url: 'https://drive.google.com/uc?export=download&id=1ehew4C2VCU3wUOVNI9iQYCrdvR8xBEGa' },
            { name: 'CAM STEADY POKEMON VILLAIN CYPHER', url: 'https://drive.google.com/uc?export=download&id=1ei3td2DGLNYpqSeO3okfcuNL7MKmzuAA' },
            { name: 'CAM STEADY POKEMON TRAINER CYPHER', url: 'https://drive.google.com/uc?export=download&id=1ejhToulOvkSfk6nR9OGMMTLmA6UKX4Zj' },
            { name: 'DPS King Me', url: 'https://drive.google.com/uc?export=download&id=1et30IuEYpNPnkqXpTLN8B9q34GDdW1eh' },
            { name: 'DPS MALEVOLENT', url: 'https://drive.google.com/uc?export=download&id=1eyaj_MS9ICvcsvrtL5LLNcM9fyQEYOZ0' },
            { name: 'DPS Fallen', url: 'https://drive.google.com/uc?export=download&id=1f51mBd2ApnQPHvgF_WJMw7OA6rQgRjCK' },
            { name: 'DPS Sins Of The Father (invincible)', url: 'https://drive.google.com/uc?export=download&id=1fE1NLQ-fagqNECLyq873QpKD7OWAgXvF' },
            { name: 'DPS Invincible (Omni Man)', url: 'https://drive.google.com/uc?export=download&id=1fMtq9bg_nfR8gTlIIXCtrgVTJE805N04' },
            { name: 'DPS Final Laugh', url: 'https://drive.google.com/uc?export=download&id=1fPRy5sMOKJlUoXFftKRXwu3rW2JgF4Pe' },
            { name: 'DPS Scary Hours (Akaza Rap)', url: 'https://drive.google.com/uc?export=download&id=1fP_tqWepLdsgsdp17e_jcZUj0jVrNISR' },
            { name: 'DPS REBEL (Bakugo)', url: 'https://drive.google.com/uc?export=download&id=1fPlYkxgcA-jyS5smZqS1VCAgtdfKO3Ea' },
            { name: 'DPS Hold Up', url: 'https://drive.google.com/uc?export=download&id=1fS8LblnHxQrA2gNVdgjxBkYMQ2yZNqWo' },
            { name: 'DPS L Rap', url: 'https://drive.google.com/uc?export=download&id=1fSsU4D6FbSgCCt8jvPSZY1Nimbls6s8r' },
            { name: 'DPS Titans', url: 'https://drive.google.com/uc?export=download&id=1fUvootRArS1PL1rjEqIj753wITat-Cvs' },
            { name: 'DPS Omni King (Zeno)', url: 'https://drive.google.com/uc?export=download&id=1fVIp12OB39pXvDqyaYYBQvkdBv0JZYMw' },
            { name: 'DPS Split (Moon Knight)', url: 'https://drive.google.com/uc?export=download&id=1fWCTkgrIKBVZ-pL4Bh182JlhGrH94Ynr' },
            { name: 'DPS Grave', url: 'https://drive.google.com/uc?export=download&id=1fWQ_0yMEir4EWytcxu8w10ohM7Wxb6tR' },
            { name: 'DPS The Rumbling', url: 'https://drive.google.com/uc?export=download&id=1fYhGCWYGtPaULCtYxbP5NoFLguS7Yk_Z' },
            { name: 'DPS Black Air Force Energy', url: 'https://drive.google.com/uc?export=download&id=1fdhe2o5Rkp5ociRBfaV6Nx9R1xD_4-Ox' },
            { name: 'DPS Over The Top', url: 'https://drive.google.com/uc?export=download&id=1fjknrupmyfdMJyZ3vP50tlUtcPQOvABR' },
            { name: 'DPS Triple Threat', url: 'https://drive.google.com/uc?export=download&id=1foe5L7d7a-YJUaaQe7I80IWBdNdVqPdQ' },
            { name: 'DPS Squid Games (Gganbu)', url: 'https://drive.google.com/uc?export=download&id=1fvdgFpDOCy8zextdsAB_zX7euPjjLAwl' },
            { name: 'DPS Forgive Me', url: 'https://drive.google.com/uc?export=download&id=1fx4dNcu08dfQ9qy08EfWphBhrDftGSjY' },
            { name: 'DPS Blood Curdle', url: 'https://drive.google.com/uc?export=download&id=1g9LrTw4RWMbqcOS0VIxObViPu66_Kqtr' },
            { name: 'DPS Cowboy Bebop (Space cowboy)', url: 'https://drive.google.com/uc?export=download&id=1gCqWKIp75VMozuW1w4CvU1ujIG3ruM0K' },
            { name: 'DPS I Am Him', url: 'https://drive.google.com/uc?export=download&id=1gIGtspADKN6RNeoOAKcYpZpO_56wCzhN' },
            { name: 'DPS tHe GoAt', url: 'https://drive.google.com/uc?export=download&id=1gJ7q8BT9_mf6zG5GQAeTLBkvCxkq78GD' },
            { name: 'DPS Cyber Psycho', url: 'https://drive.google.com/uc?export=download&id=1gKT72r52KKxbRMRt-doIp5jUsHhFPrnQ' },
            { name: 'DPS Menace', url: 'https://drive.google.com/uc?export=download&id=1gKn0NpBxfl1phK_I17QO_wcsbwW8rf3I' },
            { name: 'DPS Legend Remix', url: 'https://drive.google.com/uc?export=download&id=1gLvJAFPAv87JFWwxHEgNnktl_jvPGILb' },
            { name: 'DPS SaVaGe', url: 'https://drive.google.com/uc?export=download&id=1gNjUI5eFZzeb9oegWJU-vceRasEfAC27' },
            { name: 'DPS Ragnarok (Record of Ragnorok', url: 'https://drive.google.com/uc?export=download&id=1gO8miayxpAA7jprii1htx1oyu_oKT03L' },
            { name: 'DPS DEATH', url: 'https://drive.google.com/uc?export=download&id=1gUyxLIAHzNT4DEZD6N0f_4FzhysJbOWV' },
            { name: 'DPS London Bridge', url: 'https://drive.google.com/uc?export=download&id=1gV-trhW9BUIAt5JRpQAvUFvmNwijY_2F' },
            { name: 'DPS I\'m Better (Homelander)', url: 'https://drive.google.com/uc?export=download&id=1gXWm_Sttk8EBKiENhpK4PkQyYK-RBK5B' },
            { name: 'Let Him Cook (Sanji)', url: 'https://drive.google.com/uc?export=download&id=1gYkpxXkJsWa-pt4p5AcUF4RC6YFWyoI6' },
            { name: 'DPS All The Smoke', url: 'https://drive.google.com/uc?export=download&id=1gfHVseQvSPxTJB3dujLwH6IuqR1ApseT' },
            { name: 'DPS Your End', url: 'https://drive.google.com/uc?export=download&id=1gfwUEP9IC7k9pNvzzq4KvyunOubyfRY9' },
            { name: 'DPS Liberation', url: 'https://drive.google.com/uc?export=download&id=1gj1hlhfBJsAl2UWmdIjUECPt2awsStSh' },
            { name: 'DPS GOATED (Buddha)', url: 'https://drive.google.com/uc?export=download&id=1gjTCE7mF6bg2Q5h-bJskLdBgWENIGt4o' },
            { name: 'DPS Michael Myers (Halloween Horror Dis', url: 'https://drive.google.com/uc?export=download&id=1gmaeNBPNWe0rLDgX9jHbhU3RKGZARM-9' },
            { name: 'DPS Hoodlum', url: 'https://drive.google.com/uc?export=download&id=1gnWOPatGGxBBoBzggLlt_C8AOvuwD5tP' },
            { name: 'DPS Eye_For_An_Eye', url: 'https://drive.google.com/uc?export=download&id=1gtl-yUXLvse4fTKrfXHPkGPIB83nKVVW' },
            { name: 'DPS Transfiguration', url: 'https://drive.google.com/uc?export=download&id=1h1vENw1NgardyKLXwNpgT4n7W8RdIobX' },
            { name: 'CAM STEADY DROP DEAD!', url: 'https://drive.google.com/uc?export=download&id=1h4EtUjVayaeAREAP09qAXARjCdhXz0At' },
            { name: 'CAM STEADY MEWTWO!', url: 'https://drive.google.com/uc?export=download&id=1hKw9oKuLoini2GK5r1V96TvSrs-wC5L4' },
            { name: 'CAM STEADY YOU CANNOT BREAK ME!', url: 'https://drive.google.com/uc?export=download&id=1hNm4trSyq5XEc217U7RWHPgy9I49XDWp' },
            { name: 'CAM STEADY GOD COMPLEX!', url: 'https://drive.google.com/uc?export=download&id=1hXzrQc2ObDsi-ldsUBcc9DJjHNuUq1MI' }
        ];

        const audioElements = [];
        let currentlyPlayingIndex = -1; // Initialize to no song playing
        songs.forEach(song => {
            const audio = new Audio(song.url);
            audio.volume = 0.5; // Set default volume to 50%
            audioElements.push(audio);
        });

        // Create a div for controls
        const controlsDiv = document.createElement('div');
        controlsDiv.style.textAlign = 'center'; // Center-align controls
        controlsDiv.style.marginTop = '20px'; // Add margin from the top for controls

        // Create buttons for each song
        songs.forEach((song, index) => {
            const playButton = document.createElement('button');
            playButton.textContent = song.name;
            playButton.addEventListener('click', () => playSong(index));
            playButton.style.backgroundColor = '#222'; // Dark grey background
            playButton.style.color = 'white'; // White text
            playButton.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
            playButton.style.border = 'none';
            playButton.style.padding = '10px';
            playButton.style.margin = '5px';
            playButton.style.width = '90%'; // Make buttons fill width of the window
            playButton.style.display = 'block';
            playButton.style.marginLeft = 'auto';
            playButton.style.marginRight = 'auto';
            controlsDiv.appendChild(playButton);

            const separator = document.createElement('div');
            separator.style.height = '2px'; // Height of separator
            separator.style.backgroundColor = 'white'; // White color for separator
            separator.style.margin = '5px 0'; // Margin top and bottom to separate buttons
            controlsDiv.appendChild(separator);
        });

        // Create pause, stop, and volume controls
        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'Pause';
        pauseButton.addEventListener('click', togglePause);
        pauseButton.style.backgroundColor = '#222'; // Dark grey background
        pauseButton.style.color = 'white'; // White text
        pauseButton.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
        pauseButton.style.border = 'none';
        pauseButton.style.padding = '10px';
        pauseButton.style.margin = '5px';
        pauseButton.style.width = '90%'; // Make buttons fill width of the window
        pauseButton.style.display = 'block';
        pauseButton.style.marginLeft = 'auto';
        pauseButton.style.marginRight = 'auto';
        controlsDiv.appendChild(pauseButton);

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.addEventListener('click', stopAllSongs);
        stopButton.style.backgroundColor = '#222'; // Dark grey background
        stopButton.style.color = 'white'; // White text
        stopButton.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
        stopButton.style.border = 'none';
        stopButton.style.padding = '10px';
        stopButton.style.margin = '5px';
        stopButton.style.width = '90%'; // Make buttons fill width of the window
        stopButton.style.display = 'block';
        stopButton.style.marginLeft = 'auto';
        stopButton.style.marginRight = 'auto';
        controlsDiv.appendChild(stopButton);

        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 0;
        volumeSlider.max = 2; // Allow volume up to 200%
        volumeSlider.step = 0.1;
        volumeSlider.value = 0.5;
        volumeSlider.addEventListener('input', adjustVolume);
        volumeSlider.style.width = '90%'; // Make slider fill width of the window
        volumeSlider.style.margin = '5px';
        volumeSlider.style.display = 'block';
        volumeSlider.style.marginLeft = 'auto';
        volumeSlider.style.marginRight = 'auto';
        controlsDiv.appendChild(volumeSlider);

        // Create Loop Song button
        const loopButton = document.createElement('button');
        loopButton.textContent = 'Loop Song';
        loopButton.addEventListener('click', loopCurrentSong);
        loopButton.style.backgroundColor = '#222'; // Dark grey background
        loopButton.style.color = 'white'; // White text
        loopButton.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
        loopButton.style.border = 'none';
        loopButton.style.padding = '10px';
        loopButton.style.margin = '5px';
        loopButton.style.width = '90%'; // Make buttons fill width of the window
        loopButton.style.display = 'block';
        loopButton.style.marginLeft = 'auto';
        loopButton.style.marginRight = 'auto';
        controlsDiv.appendChild(loopButton);

        // Create a settings button
        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'Settings';
        settingsButton.addEventListener('click', openSettingsWindow);
        settingsButton.style.backgroundColor = '#222'; // Dark grey background
        settingsButton.style.color = 'white'; // White text
        settingsButton.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
        settingsButton.style.border = 'none';
        settingsButton.style.padding = '10px';
        settingsButton.style.margin = '20px auto 0'; // Center the button horizontally and add margin from the top
        settingsButton.style.width = '90%'; // Make buttons fill width of the window
        settingsButton.style.display = 'block';
        settingsButton.style.marginLeft = 'auto';
        settingsButton.style.marginRight = 'auto';
        controlsDiv.appendChild(settingsButton);

        // Create a Credits button
        const creditsButton = document.createElement('button');
        creditsButton.textContent = 'Credits';
        creditsButton.addEventListener('click', openCreditsWindow);
        creditsButton.style.backgroundColor = '#222'; // Dark grey background
        creditsButton.style.color = 'white'; // White text
        creditsButton.style.textShadow = '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white'; // Glowing effect
        creditsButton.style.border = 'none';
        creditsButton.style.padding = '10px';
        creditsButton.style.margin = '20px auto 0'; // Center the button horizontally and add margin from the top
        creditsButton.style.width = '90%'; // Make buttons fill width of the window
        creditsButton.style.display = 'block';
        creditsButton.style.marginLeft = 'auto';
        creditsButton.style.marginRight = 'auto';
        controlsDiv.appendChild(creditsButton);

        musicPlayerWindow.document.body.appendChild(controlsDiv);

        // Function to play a song
        function playSong(index) {
            stopAllSongs(); // Stop all other songs before playing
            audioElements[index].play();
            currentlyPlayingIndex = index; // Set currently playing index
        }

        // Function to toggle pause/play for the currently playing song
        function togglePause() {
            if (currentlyPlayingIndex === -1) return; // No song playing
            const isPaused = audioElements[currentlyPlayingIndex].paused;
            if (isPaused) {
                audioElements[currentlyPlayingIndex].play();
            } else {
                audioElements[currentlyPlayingIndex].pause();
            }
        }

        // Function to stop all songs
        function stopAllSongs() {
            audioElements.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            currentlyPlayingIndex = -1; // Reset currently playing index
        }

        // Function to adjust volume
        function adjustVolume() {
            const volume = parseFloat(volumeSlider.value);
            audioElements.forEach(audio => audio.volume = volume);
        }

        // Function to loop the currently playing song
        function loopCurrentSong() {
            if (currentlyPlayingIndex !== -1) {
                audioElements[currentlyPlayingIndex].loop = true;
            }
        }

function openSettingsWindow() {
    const settingsWindow = window.open('', '_blank', 'width=400,height=300,top=100,left=100');
    settingsWindow.document.title = 'Settings';
    settingsWindow.document.body.style.backgroundColor = 'black'; // Set background color to black

    // Create a div for the title
    const titleDiv = document.createElement('div');
    titleDiv.textContent = 'Change Color';
    titleDiv.style.color = '#7b6d8d'; // UltraViolet color
    titleDiv.style.textShadow = '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff'; // Neon glow effect
    titleDiv.style.fontSize = '24px';
    titleDiv.style.marginTop = '20px'; // Add margin from the top
    titleDiv.style.textAlign = 'center'; // Center the text
    settingsWindow.document.body.appendChild(titleDiv);

    const controlsDiv = document.createElement('div');
    settingsWindow.document.body.appendChild(controlsDiv);

    const colorButtons = [
        { value: 'white', label: 'White' },
        { value: 'red', label: 'Red' },
        { value: 'cyan', label: 'Cyan' },
        { value: 'purple', label: 'Purple' },
        { value: 'magenta', label: 'Magenta' },
        { value: 'lime', label: 'Lime' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'gold', label: 'Gold' },
        { value: 'blue', label: 'Blue' },
        { value: 'teal', label: 'Teal' },
        { value: 'green', label: 'Green' },
        { value: 'orange', label: 'Orange' },
        { value: 'silver', label: 'Silver' },
        { value: 'coral', label: 'Coral' },
        { value: '#E0115F', label: 'Ruby' },
        { value: '#800000', label: 'Maroon' },
        { value: '#FFC0CB', label: 'Pink' },
        { value: '#FF007F', label: 'Rose' },
        { value: '#ACE1AF', label: 'Celadon' },
        { value: '#deb887', label: 'Burlywood' },
        { value: '#fdee00', label: 'Aureolin' },
        { value: '#6082B6', label: 'Glaucous' },
        { value: '#2CFA1F', label: 'RadioActive' }, // UltraViolet and lime green
        { value: '#53322f', label: 'Gred' },
        { value: '#06ff69', label: 'Celery'},
        { value: '#0affa0', label: 'WinterGreen'},
        { value: '#7d12ff', label: 'BlackLight'},
        { value: '#26136f', label: 'Dark Blue'},
        { value: '#ff5e00', label: 'Red-Orange'}
    ];

    // Function to handle color changes
    function handleColorChange(color) {
        changeColors(color);
    }

    // Event listener for color buttons
    colorButtons.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.label;
        button.style.display = 'block';
        button.style.margin = '10px auto';
        button.style.width = '150px';
        button.style.backgroundColor = option.value;
        button.style.color = 'black'; // For visibility
        button.addEventListener('click', () => handleColorChange(option.value)); // Modified line
        controlsDiv.appendChild(button);
    });
}
// Function to change colors
function changeColors(color) {
    // Change title color and glow
    titleDiv.style.color = color;
    titleDiv.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`;

    // Change button text color and glow
    controlsDiv.childNodes.forEach(button => {
        button.style.color = color;
        button.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`;
    });

    // Change separator line color
    controlsDiv.querySelectorAll('div').forEach(line => {
        line.style.backgroundColor = color;
    });

    // Change settings window color
    settingsWindow.document.body.style.color = color;
}
        // Function to open the credits window
        function openCreditsWindow() {
            const creditsWindow = window.open('', '_blank', 'width=400,height=300,top=100,left=100');
            creditsWindow.document.title = 'Credits';
            creditsWindow.document.body.style.backgroundColor = 'black'; // Set background color to black

            const creditsText = document.createElement('div');
            creditsText.textContent = '♥♥♥ I want to be amazing enough for Angelica P. ♥♥♥';
            creditsText.style.color = 'silver'; // Silver text
            creditsText.style.textShadow = '0 0 10px silver, 0 0 20px silver, 0 0 30px silver, 0 0 40px silver'; // Glowing effect
            creditsText.style.fontSize = '24px'; // Larger font size
            creditsText.style.fontWeight = 'bold'; // Bold font
            creditsText.style.textAlign = 'center'; // Center-align text
            creditsText.style.marginTop = '20px'; // Add margin from the top
            creditsWindow.document.body.appendChild(creditsText);
        }
    }
})();