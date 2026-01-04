// ==UserScript==
// @name        YouToolBox
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @version     1.0
// @author      CodeOS99
// @description A userscript with many utility functions!
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540184/YouToolBox.user.js
// @updateURL https://update.greasyfork.org/scripts/540184/YouToolBox.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("YTB Active!");

    // COLOURS
    const lightGray = '#A9A9A9';
    const darkRed = '#8B0000';
    const darkerRed = '#900C3F';

    let menuHeld = false; // if the menu is held
    let menuOx = 0, menuOy = 0; // menu offset x and y

    // Wait until the page is fully ready to add stuff
    window.addEventListener('load', () => {
        makeMenu(); // make the menu button initially
    });

    function makeMenu() {
        const style = document.createElement('style');
            style.textContent = `
                #main-menu button {
                    cursor: pointer !important;
                }`;
        document.head.appendChild(style);

        let div = document.createElement('div');
        div.id = "main-menu";
        Object.assign(div.style, {
            position: 'fixed',
            top: '80px',
            left: '20px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '1px',
            userSelect: 'none',
            flexDirection: 'column'
        });

        let mover = document.createElement('div');
        Object.assign(mover.style, {
            width: '50px',
            height: '50px',
            backgroundColor: '#444',  // make it visible
            marginLeft: '10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            cursor: 'move',
        });
        mover.textContent = 'Move';

        let main_menu_btn = document.createElement('button');
        main_menu_btn.id = 'main-menu-btn'

        main_menu_btn.textContent = 'Show menu?';

        Object.assign(main_menu_btn.style, {
            top: '80px',
            left: '20px',
            zIndex: 9999,
            padding: '10px',
            fontSize: '14px',
            background: '#f33',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
        });

        let topMenuDiv = document.createElement('div');
        Object.assign(topMenuDiv.style, {
            width: '200px',
            height: '50px',
            backgroundColor: '#444',  // make it visible
            marginLeft: '10px',
            borderRadius: '8px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
        });

        let closeMenuBtn = document.createElement('button');
        closeMenuBtn.innerText = "X"
        Object.assign(closeMenuBtn.style, {
            top: '20px',
            left: '20px',
            width: '20px',
            zIndex: 9999,
            marginLeft: '10px',
            fontSize: '14px',
            background: 'red',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
        });

        let noteModeButton = document.createElement('button');
        noteModeButton.innerText = "NOTES"
        Object.assign(noteModeButton.style, {
            top: '80px',
            left: '20px',
            width: '50px',
            zIndex: 9999,
            marginLeft: '10px',
            fontSize: '14px',
            background: lightGray,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px',
        });

        let calculatorModeBtn = document.createElement('button');
        calculatorModeBtn.innerText = "CALC."
        Object.assign(calculatorModeBtn.style, {
            top: '80px',
            left: '20px',
            width: '50px',
            zIndex: 9999,
            marginLeft: '10px',
            marginRight: '10px',
            fontSize: '14px',
            background: lightGray,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px'
        });

        let quickSettingsModeBtn = document.createElement('button');
        quickSettingsModeBtn.innerText = "SETTINGS"
        Object.assign(quickSettingsModeBtn.style, {
            top: '80px',
            left: '20px',
            width: '50px',
            zIndex: 9999,
            marginLeft: '10px',
            fontSize: '14px',
            background: lightGray,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '10px'
        });

        topMenuDiv.appendChild(closeMenuBtn);
        topMenuDiv.appendChild(quickSettingsModeBtn);
        topMenuDiv.appendChild(noteModeButton);
        topMenuDiv.appendChild(calculatorModeBtn);

        let menuBtns = [noteModeButton, calculatorModeBtn, quickSettingsModeBtn];
        menuBtns.forEach(btn => {
            btn.onmouseenter = () => {
                btn.style.backgroundColor = 'gray';
            }

            btn.onmouseleave = () => {
                btn.style.backgroundColor = lightGray;
            }

            btn.onmousedown = () => {
                btn.style.backgroundColor = 'black'
            }
        });

        noteModeButton.onmouseup = () => {
            noteInput.style.display = 'block';
            calculatorDiv.style.display = 'none';
            quickSettingsDiv.style.display = 'none';
        }

        closeMenuBtn.onmouseover = () => {
            closeMenuBtn.style.backgroundColor = darkRed;
        };            
        closeMenuBtn.onmouseleave = () => {
            closeMenuBtn.style.backgroundColor = 'red';
        };
        closeMenuBtn.onmouseup = () => {
            closeMenuBtn.style.backgroundColor = darkerRed;
            bottomMenuDiv.style.display = 'none';
            topMenuDiv.style.display = 'none';

            main_menu_btn.style.display = 'block';

            btn.style.backgroundColor = lightGray;
        }

        let bottomMenuDiv = document.createElement('div');        
        Object.assign(bottomMenuDiv.style, {
            width: '200px',
            height: '50px',
            backgroundColor: '#444',
            marginLeft: '10px',
            borderRadius: '8px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            resize: 'both',
            overflow: 'auto'
        });

        let noteInput = document.createElement('textarea');
        noteInput.value = localStorage.getItem('ytb_notes') || '';
        noteInput.addEventListener('input', () => {
            localStorage.setItem('ytb_notes', noteInput.value);
        });
        noteInput.style.display = 'none';

        const buttonLabels = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+',
            'CLR', 'DEL', '(', ')',
        ];
        let calculatorBtns = [];

        let calculatorExpr = '';

        let calculatorDiv = document.createElement('div');
        Object.assign(calculatorDiv.style, {
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
        });

        let calcExprH1 = document.createElement('h1');
        calcExprH1.innerText = "0";
        Object.assign(calcExprH1.style, {
            backgroundColor: 'gray',
            borderRadius: '5px',
        })

        calculatorDiv.appendChild(calcExprH1);

        let calculatorBtnDiv = document.createElement('div');
        Object.assign(calculatorBtnDiv.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 50px)',
            gap: '6px',
            padding: '10px',
            justifyContent: 'center',
            alignItems: 'center'
        });

        calculatorDiv.appendChild(calculatorBtnDiv);

        bottomMenuDiv.appendChild(calculatorDiv);

        for (let i = 0; i < buttonLabels.length; i++) {
            let btn  = document.createElement('button');
            btn.innerText = buttonLabels[i];

            Object.assign(btn.style, {
                backgroundColor: lightGray,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '15px',
                fontSize: '16px',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
            });

            btn.onmouseenter = () => {
                btn.style.backgroundColor = 'gray';
            }

            btn.onmouseleave = () => {
                btn.style.backgroundColor = lightGray;
            }

            btn.onmousedown = () => {
                btn.style.backgroundColor = 'black'
            }

            btn.onmouseup = () => {
                btn.style.backgroundColor = lightGray;
                updateCalcExpr(buttonLabels[i]);
            }

            calculatorBtnDiv.appendChild(btn);

            calculatorBtns.push(btn);
        }

        function updateCalcExpr(val) {
            if(val !== 'CLR' && val !== 'DEL' && val !== '=') {
                if(calculatorExpr !== '0') calculatorExpr += val;
                else calculatorExpr = val;
            }
            else if(val === 'CLR') calculatorExpr = '0';
            else if(val === 'DEL') {
                calculatorExpr = calculatorExpr.substring(0, calculatorExpr.length-1)
                if(calculatorExpr === '') {
                    calculatorExpr = '0';
                }
            }
            else if(val === '=') {
                if(!'+-/*.'.includes(calculatorExpr[calculatorExpr.length - 1])) {
                    try {
                        calculatorExpr = eval(calculatorExpr).toString();
                    } catch(e) {
                        alert("You made an error in the expression!");
                        calculatorExpr = '0';
                    }
                }
            }

            calcExprH1.innerText = calculatorExpr;
        }

        let showCalculator = () => {
            calculatorDiv.style.display = 'flex'
            quickSettingsDiv.style.display = 'none';
            noteInput.style.display = 'none';
        }

        bottomMenuDiv.appendChild(noteInput);

        calculatorModeBtn.onmousedown = () => {
            calculatorModeBtn.style.backgroundColor = 'black';
            showCalculator();
        }

        let quickSettingsDiv = document.createElement('div');
        
        const layout = [0.5, 0.75, 1, 1.25, 1.5,
                        144, 240, 360, 480, 720
        ];

        Object.assign(quickSettingsDiv.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)', // Equal size columns
            gap: '6px',
            padding: '10px',
            justifyContent: 'center',
            alignItems: 'center',
        });


        for(let btnSpec of layout) {
            let btn = document.createElement('button');
            if(btnSpec <= 1.5) {
                if(btnSpec < 1)
                    btn.innerText = `x${btnSpec} 🐌`
                else if(btnSpec == 1)
                    btn.innerText = `x${btnSpec} 🐍`
                else
                    btn.innerText = `x${btnSpec} 🐇`

                btn.onmouseup = () => {
                    let player = document.querySelector('video');
                    player.playbackRate = btnSpec;
                    btn.style.backgroundColor = lightGray;
                }
            } else {
                btn.innerText = `${btnSpec}p`
                btn.onclick = () => {
                    // Video quality
                    let qualityMap = {
                        144: 'tiny',
                        240: 'small',
                        360: 'medium',
                        480: 'large',
                        720: 'hd720',
                    };
                    setQuality(qualityMap[btnSpec]);
                }
            }
            Object.assign(btn.style, {
                padding: '10px',
                fontSize: '14px',
                backgroundColor: lightGray,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '80px', 
            });

            btn.onmouseenter = () => {
                btn.style.backgroundColor = 'gray';
            }

            btn.onmouseleave = () => {
                btn.style.backgroundColor = lightGray;
            }

            btn.onmousedown = () => {
                btn.style.backgroundColor = 'black'
            }

            quickSettingsDiv.appendChild(btn);
        }

        function setQuality(qualityLabel) {
            const player = document.getElementById('movie_player');
            if (player && player.setPlaybackQualityRange) {
                player.setPlaybackQualityRange(qualityLabel);
                player.setPlaybackQuality(qualityLabel);
            }
        }

        function showQuickSettings() {
            quickSettingsDiv.style.display = 'grid';
            calculatorDiv.style.display = 'none';
            noteInput.style.display = 'none';
        }

        quickSettingsModeBtn.onmouseup = () => {
            showQuickSettings();
        }

        bottomMenuDiv.appendChild(quickSettingsDiv);

        mover.onmousedown = (e) => {
            if(!menuHeld) {
                menuHeld = true;
                menuOx = e.clientX - div.offsetLeft;
                menuOy = e.clientY - div.offsetTop;
                document.body.style.userSelect = 'none';
            }
        }

        document.onmouseup = () => { // add the event listener to the body because there is a possibility for the mouse to move away from the button
            menuHeld = false;
        }

        document.onmousemove = (e) => {
            if(menuHeld) {
                div.style.left = (e.clientX - menuOx) + 'px';
                div.style.top = (e.clientY - menuOy) + 'px';
            }
        }

        main_menu_btn.onclick = () => {
            main_menu_btn.style.display = 'none';

            topMenuDiv.style.display = 'flex';
            bottomMenuDiv.style.display = 'flex';
        };

        div.appendChild(mover);
        div.appendChild(main_menu_btn);

        div.appendChild(topMenuDiv);
        div.appendChild(bottomMenuDiv);

        document.body.appendChild(div);
    }
})();