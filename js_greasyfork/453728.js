// ==UserScript==
// @name         Demoji
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Copy emoji url
// @author       SStvAA
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453728/Demoji.user.js
// @updateURL https://update.greasyfork.org/scripts/453728/Demoji.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const App = class {

        constructor(){
            this.EMOJI_DEFAULT_SIZE = 48;
            this.EMOJI_PICKER_TAB_PANEL_ID = 'emoji-picker-tab-panel';
            this.EMOJI_PREVIEW_IMAGE_CLASS = 'graphicPrimary-jNHB2G';
            this.EMOJI_DISPLAY_DIALOG_BUTTON_CLASS = 'emojiButton-1fMsf3';
            this.EMOJI_DRAWER_WRAPPER_CLASS = 'drawerSizingWrapper-1txdWG';
            this.EMOJI_GENERATOR_URL = 'https://cdn.discordapp.com/emojis/*.*?size=*&quality=lossless';
            this.EMOJI_ITEM_DISABLED_CLASS = 'emojiItemDisabled-3VVnwp';
            this.EMOJI_PICKER_PREMIUM_PROMO_CLASS = 'premiumPromo-1eKAIB';
            this.EMOJI_HEADER_NAME_ID = 'emoji-picker-tab';
            this.DEMOJI_STYLE_ID = 'demoji-styles';

            this.EMOJI_HEADER_PROMO_CLASS = 'header-1ULbqO';
            this.EMOJI_FOOTER_PROMO_CLASS = 'premiumUpsell-2K2V_c';

            this.MS_BETWEEN_LOOP = 500;
            this.initialize();
        }
    
        async initialize(){
            this.generateColorClass();
            // start loop
            do{
                this.setEventAndTitleEmojis();
    
                await this.wait(this.MS_BETWEEN_LOOP);
            }while(true);
    
        }

        generateColorClass(){
            let prevStyle = document.querySelector(`#${this.DEMOJI_STYLE_ID}`);
            if(prevStyle){
                prevStyle.remove();
            }
            
            const style = document.createElement('style');
            style.id = this.DEMOJI_STYLE_ID;
            style.innerHTML = `
                .${this.EMOJI_PICKER_PREMIUM_PROMO_CLASS} {
                    display: none !important;
                }
                
                .${this.EMOJI_ITEM_DISABLED_CLASS} {
                    filter: grayscale(0%) !important;
                }

                .${this.EMOJI_HEADER_PROMO_CLASS} {
                    display: none !important;
                }

                .${this.EMOJI_FOOTER_PROMO_CLASS} {
                    display: none !important;
                }

            `;
            document.querySelector('head').appendChild(style);
        }
    
        setEventAndTitleEmojis(){
            const emojiHeaderName = document.querySelector(`#${this.EMOJI_HEADER_NAME_ID}`);
            if(emojiHeaderName){
                emojiHeaderName.innerHTML = 'Emojis <small style="margin-left: 5px; padding-top: -5px; font-size: 8pt; background-color: #4650c1; padding-left: 2px; padding-right: 2px; border-radius: 30px;">Demoji</small>'
            }
            
            const emojiPicker = document.querySelector(`#${this.EMOJI_PICKER_TAB_PANEL_ID}`);
            if(emojiPicker){
                for(const emojiButton of emojiPicker.querySelectorAll('button[data-type="emoji"]')){
                    if(emojiButton.classList.contains(this.EMOJI_ITEM_DISABLED_CLASS)){
                        console.log('added event');
                        emojiButton.addEventListener('click', (event) => {
                            this.clickedEmojiEventHandler(event);
                        });
                    }
                }

            }
    
        }

        async clickedEmojiEventHandler(event){
            const emojiUrl = this.emojiUrlGenerator(event.target.getAttribute('data-id'), document.querySelector(`.${this.EMOJI_PREVIEW_IMAGE_CLASS} > img`).src.includes('.webp') ? 'webp' : 'gif', event.shiftKey ? 2 : 1);
            // copy to clipboard and close promo
            try{
                await navigator.clipboard.writeText(emojiUrl);
                try{
                    document.querySelector(`.${this.EMOJI_DISPLAY_DIALOG_BUTTON_CLASS}`).click();
                    document.querySelector(`.${this.EMOJI_DRAWER_WRAPPER_CLASS}`).style.display = 'none';
                }catch {}
            }catch(error){
                console.error(error);
            }

        }
    
        wait(ms){
            return new Promise(function(resolve){
                setTimeout(()=>{
                    resolve();
                }, ms);
            })
        }
    
        removeClass(className, classToRemove){
            const classList = className.split(' ');
            return classList.filter((element)=>{ return !element.includes(classToRemove) }).join(' ');
        }
    
        emojiUrlGenerator(emojiId, emojiType, size){
            return this.EMOJI_GENERATOR_URL.replace('*', emojiId).replace('*', emojiType).replace('*', this.EMOJI_DEFAULT_SIZE * size);
        
        }
    }

    new App();

})();