// ==UserScript==
// @name        ShowUp.TV Tips Sounds
// @namespace   fapkamaster@gmail.com
// @author      fapka
// @description Dodaje dźwięk żetona przy otrzymywaniu wiadomości prywatnej (płatnej), napiwku na transmisji i priv (przy zakończeniu też)
// @include     https://showup.tv/* 
// @version     0.3.5
// @grant       none
// @run-at      document-end
//
// @downloadURL https://update.greasyfork.org/scripts/33439/ShowUpTV%20Tips%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/33439/ShowUpTV%20Tips%20Sounds.meta.js
// ==/UserScript==

            
        if ( added >= 4 && added <= 6 )
            soundId = 0;    
        else if ( added >= 10 && added <= 99 )
            soundId = 1;    
        else if ( added >= 100 && added <= 999 )
            soundId = 2;

        if ( soundId >= 0 ) { 
            mSoundTips[soundId].play();
            mTokenNumber = tokens;
        }
