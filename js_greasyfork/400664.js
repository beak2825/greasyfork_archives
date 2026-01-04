// ==UserScript==
// @name            LetMeUseF12
// @name:ja         [F12]は使わせて!!
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.0.1
// @description     [F12] and some other limited key operations are possible
// @description:ja  [F12]ほか制限されている幾つかのキー操作を可能に
// @author          furyu
// @match           http*://*/*
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/LetMeUseF12/issues
// @contributionURL https://memo.furyutei.work/about#%E6%B0%97%E3%81%AB%E5%85%A5%E3%81%A3%E3%81%9F%E5%BD%B9%E3%81%AB%E7%AB%8B%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%8A%E6%B0%97%E6%8C%81%E3%81%A1%E3%81%AF%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8%E3%81%A7
// @downloadURL https://update.greasyfork.org/scripts/400664/LetMeUseF12.user.js
// @updateURL https://update.greasyfork.org/scripts/400664/LetMeUseF12.meta.js
// ==/UserScript==

( () => {
const
    allowd_keycode_map = {
        116 : { // F5
            combinations : [],
        },
        122 : { // F11
            combinations : [],
        },
        123 : { // F12
            combinations : [],
        },
        68 : { // D
            combinations : [ 'altKey', ],
        },
        69 : { // E
            combinations : [ 'ctrlKey', ],
        },
        73 : { // I
            combinations : [ [ 'ctrlKey', 'shiftKey' ], ],
        },
        76 : { // L
            combinations : [ 'ctrlKey', 'metaKey', ],
        },
    },
    
    on_key_event = ( event ) => {
        if ( ( event.isComposing ) || ( event.keyCode == 229 ) ) {
            // IME入力中は無視
            return;
        }
        
        let allowd_key_info = allowd_keycode_map[ event.keyCode ];
        
        if ( ! allowd_key_info ) {
            return;
        }
        
        let combinations = allowd_key_info.combinations || [];
        
        if ( 0 < combinations.length ) {
            let match_number = combinations.filter( key_names => {
                    if ( typeof key_names == 'string' ) {
                        key_names = [ key_names ];
                    }
                    
                    return key_names.length == key_names.filter( key_name => event[ key_name ] ).length;
                } ).length;
            
            if ( match_number < 1 ) {
                return;
            }
        }
        event.stopPropagation();
    };
    
document.addEventListener( 'keydown', on_key_event, true );
document.addEventListener( 'keyup', on_key_event, true );

} )();
