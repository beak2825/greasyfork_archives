// ==UserScript==
// @name        HellHouse auto heal
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  a working zombs auto heal F to use R to buy
// @author       HellHouse
// @match        http//zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35268/HellHouse%20auto%20heal.user.js
// @updateURL https://update.greasyfork.org/scripts/35268/HellHouse%20auto%20heal.meta.js
// ==/UserScript==

(function() {
 heal = document.getElementbyClassName('hud-shop-item')[9];
 Petheal = document.getElementbyClassName('hud-shop-item')[10];
useheal = document.getElementbyClassName('hud-toolbar-item')[4];
usePetheal = document.getElementbyClassName('hud-toolbar-item')[5];
healthBar = document.getElementbyClassName('hud-heath-bar-inner')[0];
up = new Event('mouseup');
healLevel = 70


HEAL = function(){
    heal.attributes.class.value = 'hud-shop-item';
    petHeal.attributes.class.value = 'hud-shop-item';
    useHeal.dispatchEvent(up);
    usePetHeal.dispatchEvent(up);
    heal.click();
    petheal();
};

script = function(e){
    if(e.keyCode == 82){
        HEAL();
    }
};

document.add.Eventlistener('keydown',function(e){
    script(e);
});
observer = new mutationObserver(function(e){
    mutation.forEach(function(mutationRecord) {
        if(parsint(mutations[0].target.style.width) < healLevel){
            HEAL();

        }

    });
});
observer.observe(healthBar, { attributes : true , attributeFilter : ['style'] });
});
