// ==UserScript==
// @name         Lunar Client
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  The best client for FPS, Customization and more.
// @match        https://bloxd.io/
// @match        https://bloxd.io/?utm_source=pwa
// @match        https://staging.bloxd.io/
// @icon         https://pbs.twimg.com/profile_images/1482258044054491141/wK3062Ku_400x400.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491014/Lunar%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/491014/Lunar%20Client.meta.js
// ==/UserScript==

(function() {
    //copyright DS Client (GEORGECR)
    'use strict';
    let crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/7be1c5f3-9ad1-11ef-b170-45e28d82b1ad.gif';
    let CrossSize = '19';
    let colorPicker1Value = '#000000';
    let colorPicker2Value = '#FFFFFF';



    function fast_refresh() {
                        document.title = "Lunar Client";
        const maintext = document.querySelector('.Title.FullyFancyText');
        if (maintext) {
            maintext.style.webkitTextStroke = "0px";
            maintext.textContent = "Lunar Client";
            maintext.style.textShadow = "0px 0px 0px #000000";
            maintext.style.fontFamily = "Tahoma, sans-serif"
        }

        const background = document.querySelector(".HomeBackground");
        if (background) {
            background.style.backgroundImage = 'url(https://cdn2.steamgriddb.com/hero_thumb/de6ddd41822944b7a1c6f82769b53fa6.jpg)';
        }

                const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = `url(${crosshairvalue})`;
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = CrossSize + "px";
            crosshair.style.height = CrossSize + "px";
        }

        document.querySelectorAll(".HotBarItem").forEach(hotbar => {
            hotbar.style.borderRadius = "0px";
            hotbar.style.borderColor = colorPicker1Value;
            hotbar.style.backgroundColor = "transparent";
            hotbar.style.boxShadow = "none";
            hotbar.style.outline = "transparent";
        });

        document.querySelectorAll(".SelectedItem").forEach(slot => {
            slot.style.backgroundColor = "transparent";
            slot.style.boxShadow = "none";
            slot.style.borderRadius = "0px";
            slot.style.borderColor = colorPicker2Value;
            slot.style.outline = "transparent";
        });


    }
    setInterval(fast_refresh, 70 );

    const UI_aesthetics = () => {

        ['LogoContainer', 'cube' , 'HomeScreenBottomLeft'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(el => el.remove());
        });

        ['GameAdsBanner', 'HomeBannerInner'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(ads => {
                ads.style.opacity = '0';
                ads.style.transform = 'translateX(100%)';
            });
        });


                ['HeaderRight'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(optionsTR => {
                optionsTR.style.backgroundColor = "rgba(136, 50, 64,0.45)";
            });
        });
                        ['PlayerNamePreview'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(optionsTL => {
                optionsTL.style.backgroundColor = "rgba(136, 50, 64 ,0.45)";
                optionsTL.style.color = "white";
                optionsTL.style.textShadow = "none";
            });
        });
               ['SocialBarInner'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(socialbox => {
                socialbox.style.backgroundColor = "rgba(0,0,0,1)";
                socialbox.style.opacity = '1';
            });
        });

document.querySelectorAll('.InvenItem[data-inven-idx="46"], .InvenItem[data-inven-idx="47"], .InvenItem[data-inven-idx="48"], .InvenItem[data-inven-idx="49"], .InvenItem[data-inven-idx="50"]').forEach(ARMOR => {
    ARMOR.style.backgroundColor = "transparent";
    ARMOR.style.boxShadow = "none";
    ARMOR.style.borderColor = "transparent";
    ARMOR.style.outline = "transparent";
});
        document.querySelectorAll('.InvenItem[data-inven-idx="46"] .InvenItemUnfilled').forEach(armor => {
            armor.style.backgroundImage = 'url(https://piskel-imgstore-b.appspot.com/img/f7c20a66-3491-11ef-911f-9f3fc6109f85.gif)';
});
document.querySelectorAll('.InvenItem[data-inven-idx="47"] .InvenItemUnfilled').forEach(armor => {
            armor.style.backgroundImage = 'url(https://piskel-imgstore-b.appspot.com/img/bb5b78a8-3498-11ef-bcaf-9f3fc6109f85.gif)';
});
        document.querySelectorAll('.InvenItem[data-inven-idx="48"] .InvenItemUnfilled').forEach(armor => {
            armor.style.backgroundImage = 'url(https://piskel-imgstore-b.appspot.com/img/ab8a4be8-3491-11ef-8f57-9f3fc6109f85.gif)';
});
document.querySelectorAll('.InvenItem[data-inven-idx="49"] .InvenItemUnfilled').forEach(armor => {
            armor.style.backgroundImage = 'url(https://piskel-imgstore-b.appspot.com/img/f1d6cc85-3493-11ef-a098-9f3fc6109f85.gif)';
});
document.querySelectorAll('.InvenItem[data-inven-idx="50"] .InvenItemUnfilled').forEach(armor => {
            armor.style.backgroundImage = 'url(https://piskel-imgstore-b.appspot.com/img/840035a8-3491-11ef-879a-9f3fc6109f85.gif)';
});

        document.querySelectorAll('.AvailableGame').forEach(item => {
            item.style.border = "none";
            item.style.borderRadius = "0px";
            item.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.4)";
        });

        document.querySelectorAll('.AvailableGameTextInner').forEach(name => {
            name.style.textShadow = "none";
        });
        document.querySelectorAll('.AvailableGameTextWrapperBackground').forEach(removebox => {
            removebox.style.opacity= "0";
        });


    };

    document.addEventListener('DOMContentLoaded', UI_aesthetics);
    setInterval(UI_aesthetics, 1000);



const createhud = (id, zIndex) => {
    const hud = document.createElement('div');
    hud.id = id;
    hud.style.position = 'fixed';
    hud.style.width = '100%';
    hud.style.height = '114%';
    hud.style.display = 'block';
    hud.style.zIndex = zIndex;

    hud.style.pointerEvents = 'none';

    hud.addEventListener('mouseover', (event) => {
        if (event.target !== hud) {
            event.target.style.pointerEvents = 'auto';
        }
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    node.style.pointerEvents = 'auto';
                }
            });
        });
    });

    observer.observe(hud, { childList: true, subtree: true });

    document.body.appendChild(hud);
    return hud;
};
    const mainHud = createhud('toggleHud', '1003');

    const createBox = (id, zIndex) => {
        const box = document.createElement('div');
        box.id = id;
        box.style.position = 'fixed';
        box.style.top = '50%';
        box.style.left = '50%';
        box.style.transform = 'translate(-50%, -50%)';
        box.style.width = '800px';
        box.style.height = '600px';
        box.style.backgroundColor = 'rgb(40, 40, 40)';
        box.style.color = 'white';
        box.style.borderRadius = '20px';
        box.style.display = 'none';
        box.style.padding = '20px';
        box.style.overflowY = 'auto';
        box.style.zIndex = zIndex;
        mainHud.appendChild(box);
        return box;
    };
        const createmenu = (id, zIndex) => {
        const menu = document.createElement('div');
        menu.id = id;
        menu.style.position = 'fixed';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.width = '500px';
        menu.style.height = '250px';
        menu.style.color = 'white';
        menu.style.display = 'none';
        menu.style.justifyContent = 'space-between';
        menu.style.flexDirection = 'column';
        menu.style.padding = '20px';
        menu.style.alignItems = 'center';
        menu.style.zIndex = zIndex;
        mainHud.appendChild(menu);
        return menu;
    };
    const mainMenu = createmenu('toggleMenu', '1000');
    const mainBox = createBox('toggleBox', '1000');
    const settingsModal = createBox('settingsModal', '1001');
    settingsModal.style.backgroundColor = 'rgb(40, 40, 40)';

    const crosshairSettingsModal = createBox('crosshairSettingsModal', '1002');
    crosshairSettingsModal.style.backgroundColor = 'rgb(40, 40, 40)';

                        const hotbarSettingsModal = createBox('hotbarSettingsModal', '1002');
    hotbarSettingsModal.style.backgroundColor = 'rgb(40, 40, 40)'

                    const toggleshiftSettingsModal = createBox('toggleshiftSettingsModal', '1002');
    toggleshiftSettingsModal.style.backgroundColor = 'rgb(40, 40, 40)'

                           const Cosmetics = createBox('Cosmetics', '1002');
    Cosmetics.style.backgroundColor = 'rgb(40, 40, 40)'

                         const EditHud = createBox('EditHud', '1002');
    EditHud.style.backgroundColor = 'transparent'
    EditHud.style.justifyContent = 'space-between';
    EditHud.style.flexDirection = 'column';
    EditHud.style.alignItems = 'center';

                            const resolutionSettingsModal = createBox('resolutionSettingsModal', '1002');
    resolutionSettingsModal.style.backgroundColor = 'rgb(40, 40, 40)'

    const closeIcon = document.createElement('button');
    closeIcon.textContent = '✖';
    closeIcon.style.position = 'absolute';
    closeIcon.style.width = '30px';
    closeIcon.style.height = '30px';
    closeIcon.style.backgroundColor = 'transparent';
    closeIcon.style.top = '20px';
    closeIcon.style.right = '20px';
    closeIcon.style.border = 'none';
    closeIcon.style.color = 'white';
    closeIcon.style.cursor = 'pointer';
    closeIcon.addEventListener('click', function() {
    mainBox.style.display = 'none';
    });
    mainBox.appendChild(closeIcon);

    const settingsContainer = document.createElement('div');
    settingsContainer.style.display = 'flex';
    mainBox.appendChild(settingsContainer);

        const DSLogo = document.createElement('div');
DSLogo.style.backgroundImage = 'url(https://cdn2.steamgriddb.com/logo/ee4e30bee2b01d96b1574bcd6668f96f.png)';
DSLogo.style.backgroundRepeat = "no-repeat";
DSLogo.style.backgroundSize = "contain";
DSLogo.style.width = '180px';
DSLogo.style.height = '150px';
mainMenu.appendChild(DSLogo);

    const MenuText = document.createElement('button');
    MenuText.textContent = '';
    MenuText.style.textShadow = "10px 5px 5px #000000";
    MenuText.style.fontFamily = "'Bungee', sans-serif";
    MenuText.style.width = '350px';
    MenuText.style.heght = '50px';
    MenuText.style.marginBottom = '10px';
    MenuText.style.fontSize = '27px';
    MenuText.style.fontWeight = '700';
    MenuText.style.color = 'white';
    MenuText.style.backgroundColor = 'transparent';
    MenuText.style.border = 'none';
    mainMenu.appendChild(MenuText);

    const menuButtonsCon = document.createElement('div');
    menuButtonsCon.style.flexDirection = 'row';
    menuButtonsCon.style.alignItems = 'center';
    menuButtonsCon.style.display = 'flex';
    mainMenu.appendChild(menuButtonsCon);

        const settingsButton = document.createElement('button');
    settingsButton.style.fontSize = '20px';
    settingsButton.style.fontWeight = 'bold';
    settingsButton.style.width = '60px';
    settingsButton.style.height = '60px';
    settingsButton.style.backgroundColor = 'rgba(40, 40, 40, 0.97)';
    settingsButton.style.borderRadius = '10px';
    settingsButton.style.border = '2px solid rgba(50, 50, 50, 0.97)';
    settingsButton.style.outline = '2px solid rgb(30,30,30)';
    settingsButton.style.color = 'white';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.display = 'flex';
    settingsButton.style.alignItems = 'center';
    settingsButton.style.justifyContent = 'center';
    settingsButton.style.position = 'relative';

        const settingsImage = document.createElement('div');
settingsImage.style.backgroundImage = 'url(https://i.postimg.cc/MGRs1QCR/settings-icon-1964x2048-8nigtrtt.png)';
settingsImage.style.backgroundRepeat = "no-repeat";
settingsImage.style.backgroundSize = "contain";
settingsImage.style.width = '40px';
settingsImage.style.height = '40px';
settingsImage.style.opacity = '0.6';
settingsImage.style.position = 'absolute';
settingsImage.style.top = '50%';
settingsImage.style.left = '50%';
settingsImage.style.transform = 'translate(-50%, -50%)';

settingsButton.appendChild(settingsImage);

    settingsButton.addEventListener('mouseover', function() {
    settingsButton.style.outline = '2px solid rgb(255, 255, 255)';
    settingsImage.style.opacity = '0.9';
    });

    settingsButton.addEventListener('mouseout', function() {
    settingsButton.style.outline = '2px solid rgb(30, 30, 30)';
    settingsImage.style.opacity = '0.6';
    });

    settingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    menuButtonsCon.appendChild(settingsButton);


    const ModsButton = document.createElement('button');
    ModsButton.textContent = 'MODS';
    ModsButton.style.marginBottom = '10px';
    ModsButton.style.backgroundColor = 'rgba(40, 40, 40, 0.97)';
    ModsButton.style.borderRadius = '10px';
    ModsButton.style.outline = '2px solid rgb(30,30,30)';
    ModsButton.style.border = '2px solid rgba(50, 50, 50, 0.97)';
    ModsButton.style.color = 'white';
    ModsButton.style.width = '180px';
    ModsButton.style.height = '60px';
    ModsButton.style.margin = '0px 10px 0px 10px';
    ModsButton.style.fontSize = '20px';
    ModsButton.style.fontWeight = '300';
    ModsButton.style.cursor = 'pointer';

    ModsButton.addEventListener('mouseover', function() {
    ModsButton.style.outline = '2px solid rgb(255, 255, 255)';
    });

    ModsButton.addEventListener('mouseout', function() {
    ModsButton.style.outline = '2px solid rgb(30, 30, 30)';
    });

    ModsButton.addEventListener('click', function() {
        mainBox.style.display = 'block';
    });
    menuButtonsCon.appendChild(ModsButton);


    const CosmeticsButton = document.createElement('button');
    CosmeticsButton.style.backgroundColor = 'rgba(40, 40, 40, 0.97)';
    CosmeticsButton.style.borderRadius = '10px';
    CosmeticsButton.style.border = '2px solid rgba(50, 50, 50, 0.97)';
    CosmeticsButton.style.outline = '2px solid rgb(30,30,30)';
    CosmeticsButton.style.color = 'white';
    CosmeticsButton.style.width = '60px';
    CosmeticsButton.style.height = '60px';
    CosmeticsButton.style.fontSize = '20px';
    CosmeticsButton.style.fontWeight = 'bold';
    CosmeticsButton.style.cursor = 'pointer';
    CosmeticsButton.style.display = 'flex';
CosmeticsButton.style.alignItems = 'center';
CosmeticsButton.style.justifyContent = 'center';
CosmeticsButton.style.position = 'relative';

    const CosmeticsImage = document.createElement('div');
CosmeticsImage.style.backgroundImage = 'url(https://i.postimg.cc/t4RkYc5K/yellow-t-shirt-icon-mds.png)';
CosmeticsImage.style.backgroundRepeat = "no-repeat";
CosmeticsImage.style.backgroundSize = "contain";
CosmeticsImage.style.width = '45px';
CosmeticsImage.style.height = '45px';
CosmeticsImage.style.opacity = '0.6';
CosmeticsImage.style.position = 'absolute';
CosmeticsImage.style.top = '58%';
CosmeticsImage.style.left = '50%';
CosmeticsImage.style.transform = 'translate(-50%, -50%)'; // Center the image exactly

CosmeticsButton.appendChild(CosmeticsImage);

CosmeticsButton.addEventListener('mouseover', function() {
        CosmeticsButton.style.outline = '2px solid rgb(255,255,255)';
      CosmeticsImage.style.opacity = '0.9';
});

CosmeticsButton.addEventListener('mouseout', function() {
        CosmeticsButton.style.outline = '2px solid rgb(30,30,30)';
      CosmeticsImage.style.opacity = '0.6';
});

CosmeticsButton.addEventListener('click', function() {
        Cosmetics.style.display = 'block';
});
    menuButtonsCon.appendChild(CosmeticsButton);



        const ALLButton = document.createElement('button');
    ALLButton.textContent = 'All';
    ALLButton.style.marginRight = '5px';
    ALLButton.style.backgroundColor = '#A52D2D';
    ALLButton.style.borderRadius = '5px';
    ALLButton.style.border = 'none';
    ALLButton.style.color = 'white';
    ALLButton.style.width = '60px';
    ALLButton.style.height = '30px';
    ALLButton.style.fontsize = '18px';
    ALLButton.style.cursor = 'pointer';
    settingsContainer.appendChild(ALLButton);


                const EditHUDButton = document.createElement('button');
    EditHUDButton.textContent = 'Edit Hud';
    EditHUDButton.style.marginRight = '5px';
    EditHUDButton.style.backgroundColor = 'rgb(50, 50, 50)';
    EditHUDButton.style.borderRadius = '5px';
    EditHUDButton.style.border = 'none';
    EditHUDButton.style.color = 'white';
    EditHUDButton.style.width = '100px';
    EditHUDButton.style.height = '30px';
    EditHUDButton.style.fontsize = '18px';
    EditHUDButton.style.cursor = 'pointer';
    EditHUDButton.addEventListener('click', function() {
    EditHud.style.display = 'flex';
    mainBox.style.display = 'none';
    mainMenu.style.display = 'none';
    });
    settingsContainer.appendChild(EditHUDButton);

    const separator = document.createElement('hr');
    separator.style.border = '1px solid rgb(60, 60, 60)';
    separator.style.margin = '5px -5px';
    mainBox.appendChild(separator);

    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.gap = '15px';
    row1.style.marginTop = '15px';
    mainBox.appendChild(row1);

     const row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.gap = '15px';
    row2.style.marginTop = '15px';
    mainBox.appendChild(row2);

     const row3 = document.createElement('div');
    row3.style.display = 'flex';
    row3.style.gap = '15px';
    row3.style.marginTop = '15px';
    mainBox.appendChild(row3);

const armourViewBox = document.createElement('div');
armourViewBox.style.width = '170px';
armourViewBox.style.height = '170px';
armourViewBox.style.backgroundColor = 'rgb(50, 50, 50)';
armourViewBox.style.display = 'flex';
armourViewBox.style.border = '2px solid rgb(60, 60, 60)';
armourViewBox.style.flexDirection = 'column';
armourViewBox.style.justifyContent = 'space-between';
armourViewBox.style.alignItems = 'center';
armourViewBox.style.padding = '10px';
armourViewBox.style.borderRadius = '10px';

const armourViewText = document.createElement('span');
armourViewText.textContent = 'ARMOR VIEW';
armourViewBox.appendChild(armourViewText);

const armourViewToggleButton = document.createElement('button');
armourViewToggleButton.textContent = 'Enabled';
armourViewToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
armourViewToggleButton.style.borderRadius = '10px';
armourViewToggleButton.style.border = 'none';
armourViewToggleButton.style.color = 'white';
armourViewToggleButton.style.width = '160px';
armourViewToggleButton.style.height = '40px';
armourViewToggleButton.style.fontSize = '18px';
armourViewToggleButton.style.cursor = 'pointer';
armourViewBox.appendChild(armourViewToggleButton);
row1.appendChild(armourViewBox);

let selectedItemBoxInterval;

function createSelectedItemBox() {
    const selectedItemBox = document.createElement('div');
    selectedItemBox.id = 'selected-item-box';
    selectedItemBox.style.position = 'fixed';
    selectedItemBox.style.bottom = '100px';
    selectedItemBox.style.left = '31%';
    selectedItemBox.style.transformX = 'translateX(-28%)';
    selectedItemBox.style.width = '400px';
    selectedItemBox.style.height = '70px';
    selectedItemBox.style.zIndex = '9999';
    selectedItemBox.style.overflow = 'hidden';
    selectedItemBox.style.display = 'flex';
    selectedItemBox.style.alignItems = 'center';
    selectedItemBox.style.justifyContent = 'center';

    mainHud.appendChild(selectedItemBox);

    let isMoving = false;
let OffsetAX = 0;
let OffsetAY = 0;

selectedItemBox.addEventListener('mousedown', (e) => {
    if (armourViewToggleButton.textContent === 'Enabled'&& EditHud.style.display === 'flex' && e.target.nodeName !== 'INPUT') {
        isMoving = true;
        OffsetAX = e.clientX;
        OffsetAY = e.clientY;
    }
});

document.addEventListener('mousemove', (e) => {
    if (armourViewToggleButton.textContent === 'Enabled' && isMoving) {
        selectedItemBox.style.left = `${e.clientX}px`;
        selectedItemBox.style.top = `${e.clientY}px`;
    }
});

document.addEventListener('mouseup', () => isMoving = false);


    function updateSelectedItems() {
        const indices = [46, 47, 48, 49, 50];
        const selectedItemBox = document.getElementById('selected-item-box');
        if (selectedItemBox) {
            selectedItemBox.innerHTML = '';

            indices.forEach(idx => {
                const selectedItem = document.querySelector(`.InvenItem[data-inven-idx="${idx}"]`);
                if (selectedItem) {
                    const clonedItem = selectedItem.cloneNode(true);
                    clonedItem.removeAttribute('id');
                    clonedItem.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));

                    const itemImage = clonedItem.querySelector('.BlockItemWrapper img');
                    if (itemImage) {
                        itemImage.style.maxWidth = '100%';
                        itemImage.style.maxHeight = '100%';
                        itemImage.style.display = 'block';
                        itemImage.style.margin = 'auto';
                    }

                    selectedItemBox.appendChild(clonedItem);
                }
            });
        }
    }

    selectedItemBoxInterval = setInterval(updateSelectedItems, 1000);
}

function removeSelectedItemBox() {
    clearInterval(selectedItemBoxInterval);
    const selectedItemBox = document.getElementById('selected-item-box');
    if (selectedItemBox) {
        selectedItemBox.remove();
    }
}

armourViewToggleButton.addEventListener('click', function() {
    if (armourViewToggleButton.textContent === 'Enabled') {
        armourViewToggleButton.textContent = 'Disabled';
        removeSelectedItemBox();
    } else {
        armourViewToggleButton.textContent = 'Enabled';
        createSelectedItemBox();
    }
});

if (armourViewToggleButton.textContent === 'Enabled') {
    createSelectedItemBox();
}


const toggleshiftBox = document.createElement('div');
toggleshiftBox.style.width = '170px';
toggleshiftBox.style.height = '170px';
toggleshiftBox.style.backgroundColor = 'rgb(50, 50, 50)';
toggleshiftBox.style.display = 'flex';
toggleshiftBox.style.border = '2px solid rgb(60, 60, 60)';
toggleshiftBox.style.flexDirection = 'column';
toggleshiftBox.style.justifyContent = 'space-between';
toggleshiftBox.style.alignItems = 'center';
toggleshiftBox.style.padding = '10px';
toggleshiftBox.style.borderRadius = '10px';

const toggleshiftText = document.createElement('span');
toggleshiftText.textContent = 'TOGGLE SPRINT';
toggleshiftBox.appendChild(toggleshiftText);

const toggleshiftButtonContainer = document.createElement('div');
toggleshiftButtonContainer.style.display = 'flex';
toggleshiftButtonContainer.style.justifyContent = 'space-between';
toggleshiftButtonContainer.style.width = '100%';

const toggleshiftToggleButton = document.createElement('button');
toggleshiftToggleButton.textContent = 'Disabled';
toggleshiftToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
toggleshiftToggleButton.style.borderRadius = '10px';
toggleshiftToggleButton.style.border = 'none';
toggleshiftToggleButton.style.color = 'white';
toggleshiftToggleButton.style.width = '100px';
toggleshiftToggleButton.style.height = '40px';
toggleshiftToggleButton.style.fontSize = '18px';
toggleshiftToggleButton.style.cursor = 'pointer';
toggleshiftToggleButton.addEventListener('click', function() {
    if (toggleshiftToggleButton.textContent === 'Enabled') {
        toggleshiftToggleButton.textContent = 'Disabled';
        isRunning = '';
        isKeepingRunning = false;
        document.dispatchEvent(shiftUp);
    } else {//9956074932
        toggleshiftToggleButton.textContent = 'Enabled';
    }
});
toggleshiftButtonContainer.appendChild(toggleshiftToggleButton);

const toggleshiftSettingsButton = document.createElement('button');
toggleshiftSettingsButton.innerHTML = '⚙';
toggleshiftSettingsButton.style.backgroundColor = 'rgb(40, 40, 40)';
toggleshiftSettingsButton.style.borderRadius = '10px';
toggleshiftSettingsButton.style.border = 'none';
toggleshiftSettingsButton.style.color = 'white';
toggleshiftSettingsButton.style.fontSize = '24px';
toggleshiftSettingsButton.style.width = '40px';
toggleshiftSettingsButton.style.height = '40px';
toggleshiftSettingsButton.style.cursor = 'pointer';
toggleshiftSettingsButton.addEventListener('click', function() {
    toggleshiftSettingsModal.style.display = 'block';
});
toggleshiftButtonContainer.appendChild(toggleshiftSettingsButton);

toggleshiftBox.appendChild(toggleshiftButtonContainer);
row1.appendChild(toggleshiftBox);

let togglesprintKey = 'KeyF';
let isRunning = '';
let isKeepingRunning = false;

const shiftKeyData = {
    key: 'Shift',
    code: 'ShiftLeft',
    keyCode: 16,
    which: 16,
    shiftKey: true,
    ControlKey: false,
    altKey: false,
    metaKey: false,
    repeat: false,
    bubbles: true,
    cancelable: true
};

const shiftDown = new KeyboardEvent('keydown', shiftKeyData);
const shiftUp = new KeyboardEvent('keyup', shiftKeyData);

document.addEventListener('keyup', e => {
    if (toggleshiftToggleButton.textContent === 'Enabled') {
        if (e.code === togglesprintKey) {
            if (isRunning === '') {
                isRunning = 'Shift';
                isKeepingRunning = true;
                document.dispatchEvent(shiftDown);
            } else if (isRunning === 'Shift') {
                isRunning = '';
                isKeepingRunning = false;
                document.dispatchEvent(shiftUp);
            }
        } else if (e.code === 'ShiftLeft' && isRunning === 'Shift') {
            if (isKeepingRunning) {
                e.stopImmediatePropagation();
                return;
            }
            isRunning = '';
        }
    }
});

document.addEventListener('keydown', e => {
    if (toggleshiftToggleButton.textContent === 'Enabled') {
        if (e.code === 'ShiftLeft' && isRunning === '') {
            isRunning = 'Shift';
        }
    }
});

setInterval(() => {
    if (isKeepingRunning && toggleshiftToggleButton.textContent === 'Enabled') {
        document.dispatchEvent(shiftDown);
    }
}, 100);

    const crosshairBox = document.createElement('div');
    crosshairBox.style.width = '170px';
    crosshairBox.style.height = '170px';
    crosshairBox.style.backgroundColor = 'rgb(50, 50, 50)';
    crosshairBox.style.display = 'flex';
    crosshairBox.style.border = '2px solid rgb(60, 60, 60)';
    crosshairBox.style.flexDirection = 'column';
    crosshairBox.style.justifyContent = 'space-between';
    crosshairBox.style.alignItems = 'center';
    crosshairBox.style.padding = '10px';
    crosshairBox.style.borderRadius = '10px';

    const crosshairText = document.createElement('span');
    crosshairText.textContent = 'CROSSHAIR';
    crosshairBox.appendChild(crosshairText);

    const crosshairSettingsButton = document.createElement('button');
    crosshairSettingsButton.textContent = 'Customize'
    crosshairSettingsButton.style.backgroundColor = 'rgb(40, 40, 40)';
    crosshairSettingsButton.style.borderRadius = '10px';
    crosshairSettingsButton.style.border = 'none';
    crosshairSettingsButton.style.color = 'white';
    crosshairSettingsButton.style.fontSize = '18px';
    crosshairSettingsButton.style.width = '160px';
    crosshairSettingsButton.style.height = '40px';
    crosshairSettingsButton.style.cursor = 'pointer';
    crosshairSettingsButton.addEventListener('click', function() {
        crosshairSettingsModal.style.display = 'block';
    });
    crosshairBox.appendChild(crosshairSettingsButton);

    row1.appendChild(crosshairBox);

        const cpsBox = document.createElement('div');
    cpsBox.style.width = '170px';
    cpsBox.style.height = '170px';
    cpsBox.style.backgroundColor = 'rgb(50, 50, 50)';
    cpsBox.style.display = 'flex';
    cpsBox.style.border = '2px solid rgb(60, 60, 60)';
    cpsBox.style.flexDirection = 'column';
    cpsBox.style.justifyContent = 'space-between';
    cpsBox.style.alignItems = 'center';
    cpsBox.style.padding = '10px';
    cpsBox.style.borderRadius = '10px';

    const cpsText = document.createElement('span');
    cpsText.textContent = 'CPS COUNTER';
    cpsBox.appendChild(cpsText);

    const cpsButtonContainer = document.createElement('div');
    cpsButtonContainer.style.display = 'flex';
    cpsButtonContainer.style.justifyContent = 'space-between';
    cpsButtonContainer.style.width = '100%';

    const cpsToggleButton = document.createElement('button');
    cpsToggleButton.textContent = 'Disabled';
    cpsToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
    cpsToggleButton.style.borderRadius = '10px';
    cpsToggleButton.style.border = 'none';
    cpsToggleButton.style.color = 'white';
    cpsToggleButton.style.width = '160px';
    cpsToggleButton.style.height = '40px';
    cpsToggleButton.style.fontSize = '18px';
    cpsToggleButton.style.cursor = 'pointer';
let cpsCounter;
function createCPSCounter() {
    cpsCounter = document.createElement('div');
    cpsCounter.style.position = 'fixed';
    cpsCounter.style.top = '96%';
    cpsCounter.style.left = '96%';
    cpsCounter.style.padding = '5px 10px';
    cpsCounter.style.backgroundColor = '#00000066';
    cpsCounter.style.color = 'white';
    cpsCounter.style.fontSize = '16px';
    cpsCounter.style.zIndex = '1000';
    cpsCounter.innerText = 'CPS: 0';
    cpsCounter.style.cursor = 'pointer';
    mainHud.appendChild(cpsCounter);

let isMoving = false;
let OffsetCX = 0;
let OffsetCY = 0;

cpsCounter.addEventListener('mousedown', (e) => {
    if (cpsToggleButton.textContent === 'Enabled'&& EditHud.style.display === 'flex' && e.target.nodeName !== 'INPUT') {
        isMoving = true;
        OffsetCX = e.clientX;
        OffsetCY = e.clientY;
    }
});

document.addEventListener('mousemove', (e) => {
    if (cpsToggleButton.textContent === 'Enabled' && isMoving) {
        cpsCounter.style.left = `${e.clientX}px`;
        cpsCounter.style.top = `${e.clientY}px`;
    }
});

document.addEventListener('mouseup', () => isMoving = false);
}

let clickTimes = [];
let cpsInterval = null;
let clickListener = null;

cpsToggleButton.addEventListener('click', function() {
    if (cpsToggleButton.textContent === 'Disabled') {
        cpsToggleButton.textContent = 'Enabled';
        createCPSCounter();

        function countClick() {
            var currentTime = new Date().getTime();
            clickTimes.push(currentTime);
            updateCPS();
        }

        function updateCPS() {
            var currentTime = new Date().getTime();
            var oneSecondAgo = currentTime - 1000;

            clickTimes = clickTimes.filter(time => time >= oneSecondAgo);

            cpsCounter.innerText = 'CPS: ' + clickTimes.length;
        }

        clickListener = function() {
            countClick();
        };

        document.addEventListener('click', clickListener);

        cpsInterval = setInterval(updateCPS, 1000);

    } else {
        cpsToggleButton.textContent = 'Disabled';

        if (cpsInterval) {
            clearInterval(cpsInterval);
            cpsInterval = null;
        }
        if (clickListener) {
            document.removeEventListener('click', clickListener);
            clickListener = null;
        }
        if (cpsCounter) {
            cpsCounter.remove();
            cpsCounter = null;
        }
        clickTimes = [];
    }
});



    cpsBox.appendChild(cpsToggleButton);

    row2.appendChild(cpsBox);

const pingBox = document.createElement('div');
pingBox.style.width = '170px';
pingBox.style.height = '170px';
pingBox.style.backgroundColor = 'rgb(50, 50, 50)';
pingBox.style.display = 'flex';
pingBox.style.border = '2px solid rgb(60, 60, 60)';
pingBox.style.flexDirection = 'column';
pingBox.style.justifyContent = 'space-between';
pingBox.style.alignItems = 'center';
pingBox.style.padding = '10px';
pingBox.style.borderRadius = '10px';

const pingText = document.createElement('span');
pingText.textContent = 'PING COUNTER';
pingBox.appendChild(pingText);

const pingToggleButton = document.createElement('button');
pingToggleButton.textContent = 'Disabled'; // Start as disabled
pingToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
pingToggleButton.style.borderRadius = '10px';
pingToggleButton.style.border = 'none';
pingToggleButton.style.color = 'white';
pingToggleButton.style.width = '160px';
pingToggleButton.style.height = '40px';
pingToggleButton.style.fontSize = '18px';
pingToggleButton.style.cursor = 'pointer';

// Initialize pinging state
let isPinging = false; // Variable to track pinging status
let pingInterval; // Variable to store the interval ID

pingToggleButton.addEventListener('click', () => {
    isPinging = !isPinging; // Toggle pinging state

    if (isPinging) {
        pingToggleButton.textContent = 'Enabled';
        pingCounter.startPinging(1500); // Start pinging every 1.5 seconds
        pingCounter.pingTimeDisplay.style.display = 'block'; // Show ping time display
    } else {
        pingToggleButton.textContent = 'Disabled';
        clearInterval(pingInterval); // Stop pinging
        pingCounter.pingTimeDisplay.style.display = 'none'; // Hide ping time display
    }
});
pingBox.appendChild(pingToggleButton); // Add the toggle button to the container
row2.appendChild(pingBox); // Assuming row2 is defined elsewhere

class PingCounter {
    constructor(url) {
        // Store variables as local constants
        this.pingCount = 0; // Change from const to this to access in methods
        this.url = url;

        // Create an element to display ping time
        this.pingTimeDisplay = document.createElement('div');
        this.pingTimeDisplay.id = 'pingTimeDisplay';
        this.pingTimeDisplay.innerText = 'Ping : ';
        this.pingTimeDisplay.style.display = 'none'; // Hide by default

        // Style the ping time display
        this.pingTimeDisplay.style.position = 'fixed';
        this.pingTimeDisplay.style.top = '96%';
        this.pingTimeDisplay.style.left = '89%';
        this.pingTimeDisplay.style.padding = '5px 10px';
        this.pingTimeDisplay.style.backgroundColor = '#00000066' ;
        this.pingTimeDisplay.style.color = 'white';
        this.pingTimeDisplay.style.fontSize = '16px';
        this.pingTimeDisplay.style.zIndex = '1000';

        mainHud.appendChild(this.pingTimeDisplay);
    }

    ping() {
        const start = new Date().getTime();
        fetch(this.url, { method: 'HEAD', mode: 'no-cors' })
            .then(() => {
                const end = new Date().getTime();
                const pingTime = end - start;

                // Update ping time on screen
                this.pingTimeDisplay.innerText = `Ping : ${pingTime} ms`;
                this.pingCount++;
            })
            .catch((error) => {
                console.error('Ping failed:', error);
            });
    }

    // Start pinging
    startPinging(interval) {
        this.ping(); // Initial ping
        pingInterval = setInterval(() => this.ping(), interval); // Repeat pinging
    }
}

// Initialize PingCounter
const pingCounter = new PingCounter('https://bloxd.io');



const HandItemBox = document.createElement('div');
HandItemBox.style.width = '170px';
HandItemBox.style.height = '170px';
HandItemBox.style.backgroundColor = 'rgb(50, 50, 50)';
HandItemBox.style.display = 'flex';
HandItemBox.style.border = '2px solid rgb(60, 60, 60)';
HandItemBox.style.flexDirection = 'column';
HandItemBox.style.justifyContent = 'space-between';
HandItemBox.style.alignItems = 'center';
HandItemBox.style.padding = '10px';
HandItemBox.style.borderRadius = '10px';

const HandItemText = document.createElement('span');
HandItemText.textContent = 'HANDITEM VIEW';
HandItemBox.appendChild(HandItemText);

    const HandItemToggleButton = document.createElement('button');
HandItemToggleButton.textContent = 'Disabled';
HandItemToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
HandItemToggleButton.style.borderRadius = '10px';
HandItemToggleButton.style.border = 'none';
HandItemToggleButton.style.color = 'white';
HandItemToggleButton.style.width = '160px';
HandItemToggleButton.style.height = '40px';
HandItemToggleButton.style.fontSize = '18px';
HandItemToggleButton.style.cursor = 'pointer';
HandItemBox.appendChild(HandItemToggleButton);
row1.appendChild(HandItemBox);


function createHandItemBox() {
    const HandItemBox = document.createElement('div');
    HandItemBox.id = 'hand-item-box';
    HandItemBox.style.position = 'fixed';
    HandItemBox.style.bottom = '105px';
    HandItemBox.style.left = '28%';
    HandItemBox.style.width = '60px';
    HandItemBox.style.height = '60px';
    HandItemBox.style.zIndex = '9999';
    HandItemBox.style.overflow = 'hidden';
    HandItemBox.style.display = 'flex';
    HandItemBox.style.alignItems = 'center';
    HandItemBox.style.justifyContent = 'center';

    mainHud.appendChild(HandItemBox);

        let isMoving = false;
let OffsetHX = 0;
let OffsetHY = 0;

HandItemBox.addEventListener('mousedown', (e) => {
    if (HandItemToggleButton.textContent === 'Enabled'&& EditHud.style.display === 'flex' && e.target.nodeName !== 'INPUT') {
        isMoving = true;
        OffsetHX = e.clientX;
        OffsetHY = e.clientY;
    }
});

document.addEventListener('mousemove', (e) => {
    if (HandItemToggleButton.textContent === 'Enabled' && isMoving) {
        HandItemBox.style.left = `${e.clientX}px`;
        HandItemBox.style.top = `${e.clientY}px`;
    }
});

document.addEventListener('mouseup', () => isMoving = false);
}

function updateHandItems() {
    const HandItemBox = document.getElementById('hand-item-box');
    if (HandItemBox) {
        HandItemBox.innerHTML = '';

        const HandItems = document.querySelectorAll('.SelectedItem');
        HandItems.forEach(HandItem => {
            const clonedHItem = HandItem.cloneNode(true);
            clonedHItem.removeAttribute('id');
            clonedHItem.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
            Object.assign(clonedHItem.style, {
                position: 'static',
                margin: '0',
                padding: '0',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box'
            });

            HandItemBox.appendChild(clonedHItem);
        });
    }
}

let isHandItemBoxEnabled = false;

HandItemToggleButton.addEventListener('click', function() {
    isHandItemBoxEnabled = !isHandItemBoxEnabled;
    if (isHandItemBoxEnabled) {
        HandItemToggleButton.textContent = 'Enabled';
        createHandItemBox();
        setInterval(updateHandItems, 1000);
    } else {
        HandItemToggleButton.textContent = 'Disabled';
        const existingBox = document.getElementById('hand-item-box');
        if (existingBox) {
            existingBox.remove();
        }
    }
});

if (isHandItemBoxEnabled) {
    createHandItemBox();
    setInterval(updateHandItems, 1000);
}

    const cinematicBox = document.createElement('div');
cinematicBox.style.width = '170px';
cinematicBox.style.height = '170px';
cinematicBox.style.backgroundColor = 'rgb(50, 50, 50)';
cinematicBox.style.display = 'flex';
cinematicBox.style.border = '2px solid rgb(60, 60, 60)';
cinematicBox.style.flexDirection = 'column';
cinematicBox.style.justifyContent = 'space-between';
cinematicBox.style.alignItems = 'center';
cinematicBox.style.padding = '10px';
cinematicBox.style.borderRadius = '10px';

const cinematicText = document.createElement('span');
cinematicText.textContent = 'CINEMATIC MODE';
cinematicBox.appendChild(cinematicText);

    const cinematicToggleButton = document.createElement('button');
cinematicToggleButton.textContent = 'Disabled';
cinematicToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
cinematicToggleButton.style.borderRadius = '10px';
cinematicToggleButton.style.border = 'none';
cinematicToggleButton.style.color = 'white';
cinematicToggleButton.style.width = '160px';
cinematicToggleButton.style.height = '40px';
cinematicToggleButton.style.fontSize = '18px';
cinematicToggleButton.style.cursor = 'pointer';
cinematicToggleButton.addEventListener('click', function() {
    if (cinematicToggleButton.textContent === 'Enabled') {
        cinematicToggleButton.textContent = 'Disabled';
    } else {
        cinematicToggleButton.textContent = 'Enabled';
    }
});
cinematicBox.appendChild(cinematicToggleButton);

row2.appendChild(cinematicBox);


document.addEventListener('keydown', function(event) {
    var key = event.key;
    var wholeAppWrapper = document.querySelector('.WholeAppWrapper');
    if (cinematicToggleButton.textContent === 'Enabled' && (key === 'h' || key === 'H')) {
        wholeAppWrapper.style.visibility = wholeAppWrapper.style.visibility === 'hidden' ? 'visible' : 'hidden';
            mainHud.style.visibility = mainHud.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }
});

const keystrokeBox = document.createElement('div');
keystrokeBox.style.width = '170px';
keystrokeBox.style.height = '170px';
keystrokeBox.style.backgroundColor = 'rgb(50, 50, 50)';
keystrokeBox.style.display = 'flex';
keystrokeBox.style.border = '2px solid rgb(60, 60, 60)';
keystrokeBox.style.flexDirection = 'column';
keystrokeBox.style.justifyContent = 'space-between';
keystrokeBox.style.alignItems = 'center';
keystrokeBox.style.padding = '10px';
keystrokeBox.style.borderRadius = '10px';

const keystrokeText = document.createElement('span');
keystrokeText.textContent = 'KEYSTROKES';
keystrokeBox.appendChild(keystrokeText);

const keystrokeToggleButton = document.createElement('button');
keystrokeToggleButton.textContent = 'Disabled'; // Set default state to 'Disabled'
keystrokeToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
keystrokeToggleButton.style.borderRadius = '10px';
keystrokeToggleButton.style.border = 'none';
keystrokeToggleButton.style.color = 'white';
keystrokeToggleButton.style.width = '160px';
keystrokeToggleButton.style.height = '40px';
keystrokeToggleButton.style.fontSize = '18px';
keystrokeToggleButton.style.cursor = 'pointer';

keystrokeToggleButton.addEventListener('click', function() {
    if (keystrokeToggleButton.textContent === 'Enabled') {
        keystrokeToggleButton.textContent = 'Disabled';
        resetKeyStyles();
        setKeysVisibility(false);
    } else {
        keystrokeToggleButton.textContent = 'Enabled';
        setKeysVisibility(true);
    }
});

keystrokeBox.appendChild(keystrokeToggleButton);
row2.appendChild(keystrokeBox);

const keys = [
    { key: 'W', top: '5px', left: '50%' },
    { key: 'A', top: '60px', left: '31.5%' },
    { key: 'S', top: '60px', left: '50%' },
    { key: 'D', top: '60px', left: '68%' },
    { key: 'LMB', top: '115px', left: '35.5%', width: '77px' },
    { key: 'RMB', top: '115px', left: '64%', width: '77px' },
    { key: '―――', top: '170px', left: '50%', height: '25px', width: '160px', fontSize: '18px' }
];

const container = document.createElement("div");
Object.assign(container.style, {
    zIndex: "10000",
    width: "300px",
    height: "300px",
    transform: "translate(-50%, -50%)",
    top: "91%",
    left: "4.7%",
    position: "fixed",
    opacity: "70%",
    cursor : 'pointer'
});
mainHud.appendChild(container);

let isMoving = false;
let offsetX = 0;
let offsetY = 0;

container.addEventListener('mousedown', (event) => {
    if (keystrokeToggleButton.textContent === 'Enabled' && EditHud.style.display === 'flex' && event.target.nodeName !== 'INPUT') {
        isMoving = true;
        offsetX = event.clientX;
        offsetY = event.clientY;
    }
});

document.addEventListener('mousemove', (event) => {
    if (keystrokeToggleButton.textContent === 'Enabled' && isMoving) {
        container.style.left = `${event.clientX}px`;
        container.style.top = `${event.clientY}px`;
    }
});

document.addEventListener('mouseup', () => isMoving = false);

const createKeyElement = ({ key, top, left, width = '50px', height = '50px', fontSize = '24px' }) => {
    const element = document.createElement('div');
    Object.assign(element.style, {
        position: 'fixed',
        color: 'white',
        top,
        left,
        transform: 'translateX(-50%)',
        zIndex: '10000',
        fontWeight: 'bold',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        fontSize,
        height,
        width,
        textAlign: 'center',
        lineHeight: height
    });
    element.textContent = key;
    container.appendChild(element);
    return element;
};

const keyElements = keys.reduce((acc, keyConfig) => {
    acc[keyConfig.key] = createKeyElement(keyConfig);
    return acc;
}, {});

const updateKeyStyle = (key, active) => {
    if (keystrokeToggleButton.textContent === 'Enabled') {
        keyElements[key].style.backgroundColor = active ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)";
        keyElements[key].style.color = active ? "black" : "white";
    }
};

const resetKeyStyles = () => {
    Object.keys(keyElements).forEach(key => {
        keyElements[key].style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        keyElements[key].style.color = "white";
    });
};

const setKeysVisibility = (visible) => {
    Object.values(keyElements).forEach(element => {
        element.style.display = visible ? 'block' : 'none';
    });
};

if (keystrokeToggleButton.textContent === 'Disabled') {
    setKeysVisibility(false);
}

document.addEventListener('keydown', ({ key }) => {
    if (keystrokeToggleButton.textContent === 'Enabled') {
        const upperKey = key.toUpperCase();
        if (keyElements[upperKey]) updateKeyStyle(upperKey, true);
        if (key === ' ') updateKeyStyle('―――', true);
    }
});

document.addEventListener('keyup', ({ key }) => {
    if (keystrokeToggleButton.textContent === 'Enabled') {
        const upperKey = key.toUpperCase();
        if (keyElements[upperKey]) updateKeyStyle(upperKey, false);
        if (key === ' ') updateKeyStyle('―――', false);
    }
});

document.addEventListener('mousedown', ({ button }) => {
    if (keystrokeToggleButton.textContent === 'Enabled') {
        if (button === 0) updateKeyStyle('LMB', true);
        if (button === 2) updateKeyStyle('RMB', true);
    }
});

document.addEventListener('mouseup', ({ button }) => {
    if (keystrokeToggleButton.textContent === 'Enabled') {
        if (button === 0) updateKeyStyle('LMB', false);
        if (button === 2) updateKeyStyle('RMB', false);
    }
});


            const hotbarBox = document.createElement('div');
    hotbarBox.style.width = '161px';
    hotbarBox.style.height = '170px';
    hotbarBox.style.backgroundColor = 'rgb(50, 50, 50)';
    hotbarBox.style.display = 'flex';
    hotbarBox.style.border = '2px solid rgb(60, 60, 60)';
    hotbarBox.style.flexDirection = 'column';
    hotbarBox.style.justifyContent = 'space-between';
    hotbarBox.style.alignItems = 'center';
    hotbarBox.style.padding = '10px';
    hotbarBox.style.borderRadius = '10px';

    const hotbarText = document.createElement('span');
    hotbarText.textContent = 'HOTBAR';
    hotbarBox.appendChild(hotbarText);

    const hotbarSettingsButton = document.createElement('button');
    hotbarSettingsButton.textContent = 'Customize';
    hotbarSettingsButton.style.backgroundColor = 'rgb(40, 40, 40)';
    hotbarSettingsButton.style.borderRadius = '10px';
    hotbarSettingsButton.style.border = 'none';
    hotbarSettingsButton.style.color = 'white';
    hotbarSettingsButton.style.fontSize = '18px';
    hotbarSettingsButton.style.width = '160px';
    hotbarSettingsButton.style.height = '40px';
    hotbarSettingsButton.style.cursor = 'pointer';
    hotbarSettingsButton.addEventListener('click', function() {
        hotbarSettingsModal.style.display = 'block';
    });
    hotbarBox.appendChild(hotbarSettingsButton);

    row3.appendChild(hotbarBox);

           const resolutionBox = document.createElement('div');
    resolutionBox.style.width = '161px';
    resolutionBox.style.height = '170px';
    resolutionBox.style.backgroundColor = 'rgb(50, 50, 50)';
    resolutionBox.style.display = 'flex';
    resolutionBox.style.border = '2px solid rgb(60, 60, 60)';
    resolutionBox.style.flexDirection = 'column';
    resolutionBox.style.justifyContent = 'space-between';
    resolutionBox.style.alignItems = 'center';
    resolutionBox.style.padding = '10px';
    resolutionBox.style.borderRadius = '10px';



    const resolutionText = document.createElement('span');
    resolutionText.textContent = 'RESOLUTION';
    resolutionBox.appendChild(resolutionText);

        const resolution2Text = document.createElement('span');
    resolution2Text.textContent = 'ADJUSTER';
    resolution2Text.style.marginTop = '-95px';
    resolutionBox.appendChild(resolution2Text);

    const resolutionButtonContainer = document.createElement('div');
    resolutionButtonContainer.style.display = 'flex';
    resolutionButtonContainer.style.justifyContent = 'space-between';
    resolutionButtonContainer.style.width = '100%';

    const resolutionToggleButton = document.createElement('button');
    resolutionToggleButton.textContent = 'Enabled';
    resolutionToggleButton.style.backgroundColor = 'rgb(40, 40, 40)';
    resolutionToggleButton.style.borderRadius = '10px';
    resolutionToggleButton.style.border = 'none';
    resolutionToggleButton.style.color = 'white';
    resolutionToggleButton.style.width = '100px';
    resolutionToggleButton.style.height = '40px';
    resolutionToggleButton.style.fontSize = '18px';
    resolutionToggleButton.style.cursor = 'pointer';
    resolutionToggleButton.addEventListener('click', function() {
        if (resolutionToggleButton.textContent === 'Enabled') {
            resolutionToggleButton.textContent = 'Disabled';
        } else {
            resolutionToggleButton.textContent = 'Enabled';
        }
    });
    resolutionButtonContainer.appendChild(resolutionToggleButton);

    const resolutionSettingsButton = document.createElement('button');
    resolutionSettingsButton.innerHTML = '⚙';
    resolutionSettingsButton.style.backgroundColor = 'rgb(40, 40, 40)';
    resolutionSettingsButton.style.borderRadius = '10px';
    resolutionSettingsButton.style.border = 'none';
    resolutionSettingsButton.style.color = 'white';
    resolutionSettingsButton.style.fontSize = '24px';
    resolutionSettingsButton.style.width = '40px';
    resolutionSettingsButton.style.height = '40px';
    resolutionSettingsButton.style.cursor = 'pointer';
    resolutionSettingsButton.addEventListener('click', function() {
       resolutionSettingsModal.style.display = 'block';
    });
    resolutionButtonContainer.appendChild(resolutionSettingsButton);

    resolutionBox.appendChild(resolutionButtonContainer);

    row3.appendChild(resolutionBox);

    resolutionSettingsModal.innerHTML = `
        <label>RESOLUTION ADJUSTER</label>
        <button id="closeResolutionSettings" style="float: right; background: transparent; border: none; color: white; cursor: pointer;">✖</button>
        <br>
        <input type="range" id="resolutionSlider" min="0.1" max="1.0" step="0.1" value="1.0" style="width: 30%;">
        <label id="resolutionValueLabel">Resolution: 1.0x</label>
    `;


    Cosmetics.innerHTML = `
            <label>COSMETICS</label>
    <button id="closeCosmetics" style="float: right; background: transparent; border: none; color: white; cursor: pointer;">✖</button>
    <p style="color:red; font-weight:900;font-size:15px;">COMING SOON<p>
    `;

hotbarSettingsModal.innerHTML = `
    <label>HOTBAR</label>
    <button id="closeHotbarSettings" style="float: right; background: transparent; border: none; color: white; cursor: pointer;">✖</button>
    <div>
        <label for="colorPicker1">Item:</label>
        <input type="color" id="colorPicker1" name="colorPicker1" value="#0000000">

    </div>
    <div>
        <label for="colorPicker2">Selected item :</label>
        <input type="color" id="colorPicker2" name="colorPicker2" value="#ffffff">
    </div>
`;

        EditHud.innerHTML = `
    <label style="font-size :30px; font-weight:bolder;">✎EDIT THE HUD✎</label>
    <button id="CommitChanges" style=" background: rgba(40, 40, 40, 0.97) ; width:300px; height :60px; border: 2px solid rgba(50, 50, 50, 0.97); outline :2px solid rgb(30,30,30); border-radius :10px; color: white; cursor: pointer; font-size :15px; font-weight:bolder;">COMMIT CHANGES</button>
    `;

             toggleshiftSettingsModal.innerHTML = `
    <label>TOGGLE SPRINT</label>
    <button id="closetoggleshiftSettings" style="float: right; background: transparent; border: none; color: white; cursor: pointer;">✖</button>
    <div style="display: flex; flex-direction: column; align-items: center; width: 385px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
    <label style="margin-bottom: 10px; font-weight: 700;">TOGGLE KEY</label>
    <label style="margin-bottom: 5px;">Set toggle key for toggle Sprint</label>
        <input type="text" id="customSprintKey" style="width: 75px; text-align: center; margin-bottom: 10px;" readonly>
    </div>
        `;


    settingsModal.innerHTML = `
         <label">SETTINGS</label>
        <button id="closeSettings" style="float: right; background: transparent; border: none; color: white; cursor: pointer;">✖</button>
        <div style="display: flex; flex-direction: row; gap: 15px; margin-top : 5px; margin-bottom : 10px;">
        <div style="display: flex; flex-direction: column; align-items: center; width: 385px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px; margin-top: 5px;">
<label style="margin-bottom: 10px; font-weight: 700;">TOGGLE KEY</label>
        <label for="customKey" style="margin-bottom: 5px;">Set toggle key for the client menu:</label>
        <input type="text" id="customKey" style="width: 75px; text-align: center; margin-bottom: 10px;" readonly>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; width: 385px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px; margin-top: 5px;">
        <label style=" font-size: 15px; margin-bottom: 10px; font-weight: 700;" >DEEP SPACE CONTROLS</label>
        <label>Client Menu : Right Shift</label>
        <label>Toggle Sprint : F</label>
        <label>Cinematic Mode : H</label>
        </div>
        </div>
         <div style="display: flex; flex-direction: row; gap: 15px; margin-top : 5px; margin-bottom : 10px;">
        <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px; margin-top: 5px;">
        <label style=" font-size: 15px; margin-bottom: 10px; font-weight: 700;" >CURRENT VERSION</label>
        <label>Version : 1.1 </label>
        <button id="UpdateButton" style="margin-top: 80px; width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Update</button>
        </div>
        </div>
    `;
;
crosshairSettingsModal.innerHTML = `
    <label>CROSSHAIR</label>
    <button id="closeCrosshairSettings" style="float: right; background: transparent; border: none; color: white; cursor: pointer;">✖</button>
<div style="display: flex; flex-direction: row; gap: 15px; margin-top : 15px;">
    <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/7be1c5f3-9ad1-11ef-b170-45e28d82b1ad.gif" style="width: 115px; height: 115px;">
        <button id="option3Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/3a948891-4a8f-11ef-8140-5b4c5fd8c3dd.gif" style="width: 115px; height: 115px;">
        <button id="option5Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/354b6bd7-1cd8-11ef-8822-bbb60d940ece.gif" style="width: 115px; height: 115px;">
        <button id="option1Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/18315826-1cd8-11ef-a2e5-bbb60d940ece.gif" style="width: 115px; height: 115px;">
        <button id="option2Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
</div>
<div style="display: flex; flex-direction: row; gap: 15px; margin-top : 15px;">
  <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/1904aeee-9ad2-11ef-b197-45e28d82b1ad.gif" style="width: 115px; height: 115px;">
        <button id="option4Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 385px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
         <label>CROSSHAIR SETTINGS</label>
         <label style="font-size : 12px;">CROSSHAIR SIZE</label>
         <input type="range" id="crosshairSizeSlider" min="0" max="38" value="19">
               <div id="sliderValue">19</div>
    </div>
      <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/3f1093ca-4a8d-11ef-92cc-5b4c5fd8c3dd.gif" style="width: 115px; height: 115px;">
        <button id="option6Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
 </div>
 <div style="display: flex; flex-direction: row; gap: 15px; margin-top : 15px;">
       <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/d46740e1-4a92-11ef-9ed7-5b4c5fd8c3dd.gif" style="width: 115px; height: 115px;">
        <button id="option7Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
           <div style="display: flex; flex-direction: column; align-items: center; width: 185px; height: 185px; background: rgb(50, 50, 50); border: 2px solid rgb(60, 60, 60); border-radius: 10px;">
        <label>CROSSHAIR</label>
        <img src="https://piskel-imgstore-b.appspot.com/img/42579dc0-99cd-11ef-808f-0b01a4cf3689.gif" style="width: 115px; height: 115px;">
        <button id="option8Button" style="width: 150px; height: 40px; background: rgb(40, 40, 40); border: none; border-radius: 10px; color: white; font-size: 18px; cursor: pointer;">Enable</button>
    </div>
    </div>
`;


document.getElementById('option1Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/354b6bd7-1cd8-11ef-8822-bbb60d940ece.gif';
});

document.getElementById('option2Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/18315826-1cd8-11ef-a2e5-bbb60d940ece.gif';
});
document.getElementById('option3Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/7be1c5f3-9ad1-11ef-b170-45e28d82b1ad.gif';
});
    document.getElementById('option4Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/1904aeee-9ad2-11ef-b197-45e28d82b1ad.gif';
});
        document.getElementById('option5Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/3a948891-4a8f-11ef-8140-5b4c5fd8c3dd.gif';
})
        document.getElementById('option6Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/3f1093ca-4a8d-11ef-92cc-5b4c5fd8c3dd.gif';
})
                document.getElementById('option7Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/3ed96675-4a93-11ef-9811-5b4c5fd8c3dd.gif';
})
                    document.getElementById('option8Button').addEventListener('click', function() {
    crosshairvalue = 'https://piskel-imgstore-b.appspot.com/img/e5874b87-99cc-11ef-a284-0b01a4cf3689.gif';
})


document.getElementById('crosshairSizeSlider').addEventListener('input', function() {
        CrossSize = parseInt(this.value);
            document.getElementById('sliderValue').textContent = this.value;
    })

    document.getElementById('colorPicker1').addEventListener('input', function() {
    colorPicker1Value = this.value;
    document.querySelectorAll(".item").forEach(hotbar => {
        hotbar.style.backgroundColor = colorPicker1Value;
    });
});

document.getElementById('colorPicker2').addEventListener('input', function() {
    colorPicker2Value = this.value;
    document.querySelectorAll(".item").forEach(hotbar => {
        hotbar.style.borderColor = colorPicker2Value;
    });
});

                    document.getElementById('UpdateButton').addEventListener('click', function() {
     window.open('https://georgecr0.github.io/DeepSpaceClient/index.html', '_blank');
})


    const zoomSlider = document.getElementById('zoomSlider');
    const zoomValueLabel = document.getElementById('zoomValueLabel');

    let resolutionScale = 1.0;

    // Function to adjust the canvas resolution
    function adjustCanvasResolution(scale) {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        // Set the resolution scale based on the slider value
        resolutionScale = scale;

        // Adjust the internal resolution of the canvas
        const originalWidth = canvas.offsetWidth;
        const originalHeight = canvas.offsetHeight;

        // Set the canvas width and height based on the scale
        canvas.width = originalWidth * resolutionScale;
        canvas.height = originalHeight * resolutionScale;

        // Adjust the scaling in the rendering context to fit the new resolution
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.setTransform(resolutionScale, 0, 0, resolutionScale, 0, 0);
        }
    }

    // Get references to the resolution slider and resolution value label
    const resolutionSlider = document.getElementById('resolutionSlider');
    const resolutionValueLabel = document.getElementById('resolutionValueLabel');

    // Event listener for the resolution slider
    resolutionSlider.addEventListener('input', function() {
        // Update the resolution scale based on the slider value
        const scaleValue = parseFloat(resolutionSlider.value);
        adjustCanvasResolution(scaleValue);

        // Update the resolution value label
        resolutionValueLabel.textContent = `Resolution: ${scaleValue.toFixed(1)}x`;
    });

let toggleKey = 'ShiftRight';
let boxVisible = false;
let isSettingKey = false;

document.addEventListener('keydown', function(event) {
    if (isSettingKey) {
        if (document.pointerLockElement) document.exitPointerLock();
        toggleKey = event.code;
        document.getElementById('customKey').value = toggleKey;
        isSettingKey = false;
    } else if (event.code === toggleKey) {
        boxVisible = !boxVisible;

        mainBox.style.display = boxVisible ? 'none' : 'none';
        Cosmetics.style.display = boxVisible ? 'none' : 'none';
        mainMenu.style.display = boxVisible ? 'flex' : 'none';
        settingsModal.style.display = boxVisible ? 'none' : 'none';
        crosshairSettingsModal.style.display = boxVisible ? 'none' : 'none';
        toggleshiftSettingsModal.style.display = boxVisible ? 'none' : 'none';
        resolutionSettingsModal.style.display = boxVisible ? 'none' : 'none';
        hotbarSettingsModal.style.display = boxVisible ? 'none' : 'none';
        if (boxVisible) {
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }
        } else {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.requestPointerLock();
            }
        }
    }
});

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) {
        console.log("Pointer locked to game");
    } else {
        console.log("Pointer unlocked from game");
    }
});

     document.getElementById('CommitChanges').addEventListener('click', function() {
        EditHud.style.display = 'none';
        mainMenu.style.display = 'flex';
        mainBox.style.display = 'block';
    });

    const customSprintKeyInput = document.getElementById('customSprintKey');
customSprintKeyInput.addEventListener('keydown', (e) => {
    e.preventDefault();
    togglesprintKey = e.code;
    customSprintKeyInput.value = e.key.toUpperCase();
});
        document.getElementById('customSprintKey').addEventListener('click', function() {
        this.value = 'PRESS A KEY';
    });

settingsButton.addEventListener('click', function() {
    settingsModal.style.display = 'block';
});

    closeIcon.addEventListener('click', function() {
    mainBox.style.display = 'none';
});

    document.getElementById('closeCosmetics').addEventListener('click', function() {
        Cosmetics.style.display = 'none';
    });

              document.getElementById('closeResolutionSettings').addEventListener('click', function() {
        resolutionSettingsModal.style.display = 'none';
    });

    document.getElementById('customKey').addEventListener('click', function() {
        isSettingKey = true;
        this.value = 'PRESS A KEY';
    });
        document.getElementById('closeHotbarSettings').addEventListener('click', function() {
        hotbarSettingsModal.style.display = 'none';
    });
    document.getElementById('closeSettings').addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    document.getElementById('closeCrosshairSettings').addEventListener('click', function() {
        crosshairSettingsModal.style.display = 'none';

    });
                                document.getElementById('closetoggleshiftSettings').addEventListener('click', function() {
       toggleshiftSettingsModal.style.display = 'none';
    });

})();