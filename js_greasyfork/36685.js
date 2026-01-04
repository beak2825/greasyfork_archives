// ==UserScript==
// @name         Zombs.io Mod
// @version      v0.9
// @description  Zombs.io Auto Heal
// @author       Steven
// @match        http://zombs.io/
// @grant        none
// @namespace https://greasyfork.org/users/163691
// @downloadURL https://update.greasyfork.org/scripts/36685/Zombsio%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/36685/Zombsio%20Mod.meta.js
// ==/UserScript==

(function() {
 heal = document.getElementbyClassName('hud-shop-item')[9];
 Petheal = document.getElementbyClassName('hud-shop-item')[10];
useheal = document.getElementbyClassName('hud-toolbar-item')[4];
usePetheal = document.getElementbyClassName('hud-toolbar-item')[5];
healthBar = document.getElementbyClassName('hud-heath-bar-inner')[0];
up = new Event('mouseup');
healLevel = 70;


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
