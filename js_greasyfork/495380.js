// ==UserScript==
// @name    EvoWorld.io MEGAHACK
// @name:ru EvoWorld.io MEGAHACK
// @name:en EvoWorld.io MEGAHACK
// @name:es EvoWorld.io MEGAHACK
// @name:fr EvoWorld.io MEGAHACK
// @name:de EvoWorld.io MEGAHACK
// @name:it EvoWorld.io MEGAHACK
// @name:pt EvoWorld.io MEGAHACK
// @name:zh EvoWorld.io MEGAHACK
// @name:ja EvoWorld.io MEGAHACK
// @name:ko EvoWorld.io MEGAHACK
// @name:ar EvoWorld.io MEGAHACK
// @name:hi EvoWorld.io MEGAHACK
// @name:tr EvoWorld.io MEGAHACK
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description    Cheat for evoworld/flyordie with 25+ hacks and emoji hack mod for evoworld! The largest cheat with good and understandable code. Please support this project, I did all this ALONE! It's still a beta version.
// @description:ru Чит для evoworld/flyordie в котором есть 25+ хаков и emoji hack мод для evoworld! Самый крупный чит с хорошим и понятным кодом. Пожалуйста, поддержите этот проект, я делал всё это В ОДИНОЧКУ! Пока это ещё beta версия.
// @description:en Cheat for evoworld/flyordie with 25+ hacks and emoji hack mod for evoworld! The largest cheat with good and understandable code. Please support this project, I did all this ALONE! It's still a beta version.
// @description:es Trampa para evoworld/flyordie con 25+ hacks y emoji hack mod para evoworld! La trampa más grande con código bueno y comprensible. Por favor, apoya este proyecto, ¡lo hice todo SOLO! Todavía es una versión beta.
// @description:fr Triche pour evoworld/flyordie avec plus de 25 hacks et un mod hack emoji pour evoworld ! Le plus grand cheat avec un code bon et compréhensible. S'il vous plaît, soutenez ce projet, j'ai fait tout cela SEUL ! C'est encore une version bêta.
// @description:de Cheat für evoworld/flyordie mit 25+ Hacks und Emoji-Hack-Mod für evoworld! Der größte Cheat mit gutem und verständlichem Code. Bitte unterstützen Sie dieses Projekt, ich habe das alles ALLEIN gemacht! Es ist immer noch eine Beta-Version.
// @description:it Cheat per evoworld/flyordie con oltre 25 hack e mod hack emoji per evoworld! Il cheat più grande con un codice buono e comprensibile. Per favore, supporta questo progetto, ho fatto tutto questo DA SOLO! È ancora una versione beta.
// @description:pt Cheat para evoworld/flyordie com mais de 25 hacks e mod hack de emoji para evoworld! O maior cheat com um código bom e compreensível. Por favor, apoie este projeto, eu fiz tudo isso SOZINHO! Ainda é uma versão beta.
// @description:zh 为evoworld/flyordie提供25+黑客和emoji黑客模块的作弊！这是最大的作弊，代码好且易懂。请支持这个项目，我是独自一人完成的！目前仍是测试版。
// @description:ja evoworld/flyordie用の25以上のハックとemojiハックモッドを含むチート！理解しやすい良いコードを持つ最大のチートです。このプロジェクトをサポートしてください、私はこれをすべて一人で行いました！まだベータ版です。
// @description:ko evoworld/flyordie를 위한 25개 이상의 핵과 evoworld를 위한 이모지 핵 모드가 포함된 치트! 좋은 이해하기 쉬운 코드로 된 가장 큰 치트입니다. 이 프로젝트를 지원해 주세요, 저는 이 모든 것을 혼자 했습니다! 아직 베타 버전입니다.
// @description:ar غش ل evoworld/flyordie مع أكثر من 25 اختراقات و mod اختراق emoji ل evoworld! أكبر غش مع كود جيد ومفهوم. يرجى دعم هذا المشروع، لقد فعلت كل هذا وحدي! لا يزال في النسخة التجريبية.
// @description:hi evoworld/flyordie के लिए 25+ हैक्स और evoworld के लिए इमोजी हैक मोड के साथ चीट! अच्छे और समझने योग्य कोड के साथ सबसे बड़ा चीट। कृपया इस परियोजना का समर्थन करें, मैंने यह सब अकेले किया है! यह अभी भी एक बीटा संस्करण है.
// @description:tr evoworld/flyordie için 25'ten fazla hack ve evoworld için emoji hack modu içeren hile! İyi ve anlaşılır kodla en büyük hile. Lütfen bu projeyi destekleyin, bunu TEK BAŞIMA yaptım! Hala bir beta sürümüdür.
// @author       ChyppitauCoder
// @match        https://evoworld.io/
// @icon         https://steamuserimages-a.akamaihd.net/ugc/2044108148224666217/6A44151F7534306FEC8259BDE5496463C9B55720/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true
// @grant        GM_xmlhttpRequest
// @contributionURL https://www.donationalerts.com/r/ChyppitauZ
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495380/EvoWorldio%20MEGAHACK.user.js
// @updateURL https://update.greasyfork.org/scripts/495380/EvoWorldio%20MEGAHACK.meta.js
// ==/UserScript==

let overlay = '';
let url = 'https://raw.githubusercontent.com/ChyppitauCoder/EvoWorld.io-MegaHack-2.0/main/MegaHack.html';

GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(response) {
        if (response.status === 200) {
            overlay = response.responseText;
            console.log('HTML content loaded:', overlay);
            if (confirm('are you sure want to run a script?')){
                main();
            } else {
                if (confirm('maybe you run script with no ban advice?')) {
                    alert('than use just hotkeys, cosmetic and visual hacks in this script. +advice');
                    if (confirm('Are you sure want to run this script with no ban advice?')){
                        main();
                    }
                }
            }
        } else {
            console.error('Failed to load HTML content:', response.statusText);
        }
    }
});

function main() {
    alert("Warning, you can will get banned! TO OPEN OR CLOSE MENU PRESS TAB OR F9");
    let cheatMenu = document.createElement("div");

    let able_to_click_hack = false;
    let no_confirms_in_hack = false;

    cheatMenu.innerHTML = overlay;
    cheatMenu.style.opacity = "0";
    document.body.appendChild(cheatMenu);

    let main_hack = cheatMenu.querySelector(".main-hack");

    if (!main_hack) {
        alert("Element with class 'main-hack' not found! Cheat doesn't work!");
        return;
    }

    main_hack.style.width = "0%";
    main_hack.style.height = "0%";

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab' || event.key === "F9") {
            if (cheatMenu.style.opacity === "1") {
                cheatMenu.style.transition = "opacity 0.5s ease, width 0.5s ease, height 0.5s ease";
                cheatMenu.style.opacity = "0";
                main_hack.style.transition = "width 0.5s ease, height 0.5s ease";
                main_hack.style.width = "0%";
                main_hack.style.height = "0%";
                setTimeout(() => {
                    able_to_click_hack = false;
                }, 500);
            } else {
                cheatMenu.style.transition = "opacity 0.5s ease, width 0.5s ease, height 0.5s ease";
                cheatMenu.style.opacity = "1";
                main_hack.style.transition = "width 0.5s ease, height 0.5s ease";
                main_hack.style.width = "110%";
                main_hack.style.height = "85%";
                setTimeout(() => {
                    able_to_click_hack = true;
                }, 500);
            }
        }
    });

    document.querySelectorAll('.hack-main-section button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.hack-main-section button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            button.style.backgroundColor = "black";
        });
    });

    let option1 = document.getElementById("reload-hack");
    let option2 = document.getElementById("sky-bs-mod-hack");
    let option3 = document.getElementById("pixelvoices-mod-hack");
    let option4 = document.getElementById("any-level-hack");
    let option5 = document.getElementById("show-codes-hack");
    let option7 = document.getElementById("unlock-zoom-hack");
    let option9 = document.getElementById("exit-game-hack");
    let option10 = document.getElementById("xp-hack");
    let option12 = document.getElementById("hp-hack");
    let option13 = document.getElementById("height-hack-hack");
    let option14 = document.getElementById("unlock-nick-hack");
    let option15 = document.getElementById("premium-hack");
    let option16 = document.getElementById("print-scr-hack");
    let option17 = document.getElementById("inject-hack");
    let option19 = document.getElementById("smooth-movements-hack");
    let option20 = document.getElementById("enter-title-hack");
    let option21 = document.getElementById("scan-players-hack");
    let option22 = document.getElementById("admin-hack");
    let option24 = document.getElementById("show-label-hack");
    let option25 = document.getElementById("next-level-hack");
    let option26 = document.getElementById("bind-hack");
    let option28 = document.getElementById("auto-respawn-hack");
    let option30 = document.getElementById("play-again-hack");
    let option31 = document.getElementById("del-label-hack");
    let option33 = document.getElementById("night-k-hack");
    let option34 = document.getElementById("fps-bypass-hack");
    let option35 = document.getElementById("dont-hide-me-hack");
    let option36 = document.getElementById("dont-hide-players-hack");
    let option37 = document.getElementById("adblock-detect-bypass-hack");
    let option38 = document.getElementById("no-ads");

    // let res1 = document.getElementById("resize-handle-top-left");
    // let res2 = document.getElementById("resize-handle-top-right");
    // let res3 = document.getElementById("resize-handle-bottom-left");
    // let res4 = document.getElementById("resize-handle-bottom-right");

    // res1.style.opacity = 0;
    // res2.style.opacity = 0;
    // res3.style.opacity = 0;
    // res4.style.opacity = 0;

    let intervalId;
    let isClicking = false;

    function clickMouse(x, y) {
        const element = document.elementFromPoint(x, y);
        if (element) {
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            });
            element.dispatchEvent(clickEvent);
            console.log(`Clicked at (${x}, ${y})`); // debug log
        } else {
            console.log(`No element at (${x}, ${y})`); // debug log
        }
    }

    function startAutoClicker() {
        document.getElementById('startAutoClicker').style.backgroundColor = "black";
        if (isClicking) return;
        const clicksPerSecond = parseInt(document.getElementById('clicksPerSecond').value);
        const interval = 1000 / clicksPerSecond;
        isClicking = true;

        intervalId = setInterval(() => {
            const { clientX: x, clientY: y } = getMousePosition();
            clickMouse(x, y);
        }, interval);
    }

    function stopAutoClicker() {
        document.getElementById('stopAutoClicker').style.backgroundColor = "black";
        clearInterval(intervalId);
        isClicking = false;
        console.log('Auto clicker stopped');
    }

    let mousePosition = { x: 0, y: 0 };
    document.addEventListener('mousemove', (event) => {
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
        // console.log(`Mouse moved to (${mousePosition.x}, ${mousePosition.y})`); // debug log (will be deleted)
    });

    function getMousePosition() {
        return { clientX: mousePosition.x, clientY: mousePosition.y };
    }

    document.getElementById('startAutoClicker').addEventListener('click', startAutoClicker);
    document.getElementById('stopAutoClicker').addEventListener('click', stopAutoClicker);

    let set1 = document.getElementById("no-confirms-hack");
    let set2 = document.getElementById("allow-move-cheat-menu-hack");
    let set3 = document.getElementById("enable-confirms-hack");

    let chyppitau_license = document.getElementById("chyppitau_license");
    let license_chyppitau_hack = "Most up";
    chyppitau_license.innerHTML = `License: ${license_chyppitau_hack}`;

    if (license_chyppitau_hack === "Default"){
        option35.style.opacity = "0.3";
        option35.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option35.setAttribute('disabled', '');


        option10.style.opacity = "0.3";
        option10.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option10.setAttribute('disabled', '');

        option30.style.opacity = "0.3";
        option30.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option30.setAttribute('disabled', '');

        option24.style.opacity = "0.3";
        option24.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option24.setAttribute('disabled', '');

        option31.style.opacity = "0.3";
        option31.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option31.setAttribute('disabled', '');

        option28.style.opacity = "0.3";
        option31.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option31.setAttribute('disabled', '');

        option37.style.opacity = "0.3";
        option37.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option37.setAttribute('disabled', '');
        
        option38.style.opacity = "0.3";
        option38.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option38.setAttribute('disabled', '');
        
        option36.style.opacity = "0.3";
        option36.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option36.setAttribute('disabled', '');
        
        option35.style.opacity = "0.3";
        option35.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option35.setAttribute('disabled', '');
        
        option34.style.opacity = "0.3";
        option34.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        option34.setAttribute('disabled', '');

        set1.style.opacity = "0.3";
        set1.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        set1.setAttribute('disabled', '');

        set2.style.opacity = "0.3";
        set2.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        set2.setAttribute('disabled', '');

        set3.style.opacity = "0.3";
        set3.addEventListener("click", () => {
            alert("to use this func you need to be a license: Most up.");
        });
        set3.setAttribute('disabled', '');
    }

    if (license_chyppitau_hack === "Most up"){
        let text_hack_vhy = document.getElementById("little-text-in-the-hack-chyppitau");
        text_hack_vhy.remove();
    }
    document.getElementById('chyppitauE1').addEventListener("click", () => {if(able_to_click_hack) sendChat(1)});
    document.getElementById('chyppitauE2').addEventListener("click", () => {if(able_to_click_hack) sendChat(2)});
    document.getElementById('chyppitauE3').addEventListener("click", () => {if(able_to_click_hack) sendChat(3)});
    document.getElementById('chyppitauE4').addEventListener("click", () => {if(able_to_click_hack) sendChat(4)});
    document.getElementById('chyppitauE5').addEventListener("click", () => {if(able_to_click_hack) sendChat(5)});
    document.getElementById('chyppitauE6').addEventListener("click", () => {if(able_to_click_hack) sendChat(6)});
    document.getElementById('chyppitauE7').addEventListener("click", () => {if(able_to_click_hack) sendChat(7)});
    document.getElementById('chyppitauE8').addEventListener("click", () => {if(able_to_click_hack) sendChat(8)});
    document.getElementById('chyppitauE9').addEventListener("click", () => {if(able_to_click_hack) sendEmote(1)});
    document.getElementById('chyppitauE10').addEventListener("click", () => {if(able_to_click_hack) sendEmote(12)});
    document.getElementById('chyppitauE11').addEventListener("click", () => {if(able_to_click_hack) sendEmote(2)});
    document.getElementById('chyppitauE12').addEventListener("click", () => {if(able_to_click_hack) sendEmote(6)});
    document.getElementById('chyppitauE13').addEventListener("click", () => {if(able_to_click_hack) sendEmote(4)});
    document.getElementById('chyppitauE14').addEventListener("click", () => {if(able_to_click_hack) sendEmote(11)});
    document.getElementById('chyppitauE15').addEventListener("click", () => {if(able_to_click_hack) sendEmote(10)});
    document.getElementById('chyppitauE16').addEventListener("click", () => {if(able_to_click_hack) sendEmote(3)});
    document.getElementById('chyppitauE17').addEventListener("click", () => {if(able_to_click_hack) sendEmote(7)});
    document.getElementById('chyppitauE18').addEventListener("click", () => {if(able_to_click_hack) sendEmote(8)});

    let author_anothers_hacks = document.getElementById("my-another-hacks");

    let leaderboard_nicknames_select = document.getElementById("leaderboard-nicknames");
    let copy_players_nicks_button = document.getElementById("copy-player-nick-hack");
    copy_players_nicks_button.addEventListener("click", () => {
        if (able_to_click_hack){
            copy_players_nicks_button.style.backgroundColor = "black";

            let value = leaderboard_nicknames_select.value;

            if (value === "-"){
                alert("Select nick!");
            }

            if (value === "1"){
                let copy_nick_name_hack = leaderboard[0].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }

            if (value === "2"){
                let copy_nick_name_hack = leaderboard[1].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }

            if (value === "3"){
                let copy_nick_name_hack = leaderboard[2].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "4"){
                let copy_nick_name_hack = leaderboard[3].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "5"){
                let copy_nick_name_hack = leaderboard[4].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "6"){
                let copy_nick_name_hack = leaderboard[5].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "7"){
                let copy_nick_name_hack = leaderboard[6].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "8"){
                let copy_nick_name_hack = leaderboard[7].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "9"){
                let copy_nick_name_hack = leaderboard[8].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
            
            if (value === "10"){
                let copy_nick_name_hack = leaderboard[9].nick;
                navigator.clipboard.writeText(copy_nick_name_hack).then(() => {
                    alert(copy_nick_name_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
        }
    });

    set1.addEventListener("click", () => {
        if (able_to_click_hack){
            no_confirms_in_hack = true;
        }
    });

    set2.addEventListener("click", () => {
        if (able_to_click_hack) {

            const cheatMenu = document.getElementById('cheatMenu');

            // const res1 = document.getElementById('res1');
            // const res2 = document.getElementById('res2');
            // const res3 = document.getElementById('res3');
            // const res4 = document.getElementById('res4');

            if (cheatMenu) {
                cheatMenu.style.position = "absolute";
                cheatMenu.style.opacity = "1";

                let isDragging = false;
                let isResizing = false;
                let startX, startY, startWidth, startHeight;

                function moveMenu(e) {
                    if (isDragging) {
                        let posX = e.clientX - startX;
                        let posY = e.clientY - startY;

                        cheatMenu.style.left = posX + 'px';
                        cheatMenu.style.top = posY + 'px';
                    }
                }

                function startDragging(e) {
                    if (cheatMenu.style.opacity === "1") {
                        isDragging = true;
                        startX = e.clientX - cheatMenu.offsetLeft;
                        startY = e.clientY - cheatMenu.offsetTop;
                        document.addEventListener('mousemove', moveMenu);
                        document.addEventListener('mouseup', stopDragging);
                    }
                }

                function stopDragging() {
                    isDragging = false;
                    document.removeEventListener('mousemove', moveMenu);
                    document.removeEventListener('mouseup', stopDragging);
                }

                // function resizeMenu(e) {
                //     if (isResizing) {
                //         let newWidth = startWidth + (e.clientX - startX);
                //         let newHeight = startHeight + (e.clientY - startY);

                //         stopDragging();
                //         cheatMenu.style.width = newWidth + 'px';
                //         cheatMenu.style.height = newHeight + 'px';
                //     }
                // }

                // function startResizing(e) {
                //     if (cheatMenu.style.opacity === "1") {
                //         isResizing = true;
                //         stopDragging();
                //         startX = e.clientX;
                //         startY = e.clientY;
                //         startWidth = cheatMenu.offsetWidth;
                //         startHeight = cheatMenu.offsetHeight;
                //         document.addEventListener('mousemove', resizeMenu);
                //         document.addEventListener('mouseup', stopResizing);
                //     }
                // }

                // function stopResizing() {
                //     isResizing = false;
                //     document.removeEventListener('mousemove', resizeMenu);
                //     document.removeEventListener('mouseup', stopResizing);
                // }

                cheatMenu.addEventListener('mousedown', startDragging);

                // res1.addEventListener('mousedown', startResizing);
                // res2.addEventListener('mousedown', startResizing);
                // res3.addEventListener('mousedown', startResizing);
                // res4.addEventListener('mousedown', startResizing);
            }
        }
    });

    set3.addEventListener("click", ()=>{
        if (able_to_click_hack){
            no_confirms_in_hack = false;
        }
    });

    option1.addEventListener("click", () => {
        if (able_to_click_hack){
            window.location.reload();
        }
    });

    option2.addEventListener("click", () => {
        if (able_to_click_hack){
            option2.style.backgroundColor = "white";
            option2.style.color = "black";
            game['me']['level'] = 40;
            game['me']['nick'] = '\x20Sky (*BS*)';
        }
    });

    option3.addEventListener("click", () => {
        if (able_to_click_hack){
            option3.style.backgroundColor = "white";
            option2.style.color = "black";
            game['me']['level'] = 999;
            game['me']['nick'] = '\x20PixelVoices';
        }
    });

    option4.addEventListener("click", () => {
        if (able_to_click_hack){
            option4.style.backgroundColor = "white";
            option2.style.color = "black";
            let level = prompt('Enter your level: ');

            if (level !== null) {
                game['me']['level'] = level;
            }
        }
    });

    option5.addEventListener("click", () => {
        if (able_to_click_hack) {
            let copy_val_hack = "nortos, skybs, plaxer1, JeromeAS, PixelVoices, xxostepolse";
            alert(copy_val_hack);
            if (!no_confirms_in_hack){
                if (confirm("Copy to clipboard?")) {
                    navigator.clipboard.writeText(copy_val_hack).then(() => {
                        alert(copy_val_hack + " copied to clipboard!");
                    }).catch(err => {
                        alert("Failed to copy text: ", err);
                    });
                }
            } else {
                navigator.clipboard.writeText(copy_val_hack).then(() => {
                    alert(copy_val_hack + " copied to clipboard!");
                }).catch(err => {
                    alert("Failed to copy text: ", err);
                });
            }
        }
    });

    option7.addEventListener("click", () => {
        if (able_to_click_hack){
            if (no_confirms_in_hack){
                function zoomHack(a) {
                    game.canvas.addEventListener("wheel", function () {
                        if (!joinedGame || typeof event == "undefined") {
                            return;
                        }
    
                        var qwe = 0.1;
                        if (event.deltaY > 0) {
                            qwe *= -1;
                        }
    
                        gameZoom += qwe;
                        event.preventDefault();
                    });
    
                    Engine.prototype.setZoom = function (ret) {
                        if (ret <= 0.7) {
                            ret = 0.7;
                        }
    
                        if (this.zoom == ret) {
                            return;
                        }
    
                        this.zoom = ret;
                        this.staticCanvasRenderOffset.restX = 0;
                        this.staticCanvasRenderOffset.restY = 0;
                        this.staticCanvasRenderOffset.x = 0;
                        this.staticCanvasRenderOffset.y = 0;
                        this.staticCanvasRenderPosition.x = 0;
                        this.staticCanvasRenderPosition.y = 0;
                        this.context.save();
                        this.context.fillStyle = "rgba(0,0,0,1)";
                        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        this.context.restore();
                        this.staticContext.save();
                        this.staticContext.fillStyle = "rgba(0,0,0,1)";
                        this.staticContext.fillRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
                        this.staticContext.restore();
                        this.dynamicContext.clearRect(0, 0, this.dynamicCanvas.width, this.dynamicCanvas.height);
                        this.clearStaticObjects();
    
                    }
                }
    
                zoomHack();
            } else {
                if(confirm("visit authour's script page on greasy fork?")){
                    window.open("https://greasyfork.org/ru/scripts/457502-evoworld-io-cheats");
                }
                if (confirm("This works only to zoom in. Zoom out not work work. Are you sure want to run this hack?")){
                    function zoomHack(a) {
                        game.canvas.addEventListener("wheel", function () {
                            if (!joinedGame || typeof event == "undefined") {
                                return;
                            }
        
                            var qwe = 0.1;
                            if (event.deltaY > 0) {
                                qwe *= -1;
                            }
        
                            gameZoom += qwe;
                            event.preventDefault();
                        });
        
                        Engine.prototype.setZoom = function (ret) {
                            if (ret <= 0.7) {
                                ret = 0.7;
                            }
        
                            if (this.zoom == ret) {
                                return;
                            }
        
                            this.zoom = ret;
                            this.staticCanvasRenderOffset.restX = 0;
                            this.staticCanvasRenderOffset.restY = 0;
                            this.staticCanvasRenderOffset.x = 0;
                            this.staticCanvasRenderOffset.y = 0;
                            this.staticCanvasRenderPosition.x = 0;
                            this.staticCanvasRenderPosition.y = 0;
                            this.context.save();
                            this.context.fillStyle = "rgba(0,0,0,1)";
                            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
                            this.context.restore();
                            this.staticContext.save();
                            this.staticContext.fillStyle = "rgba(0,0,0,1)";
                            this.staticContext.fillRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
                            this.staticContext.restore();
                            this.dynamicContext.clearRect(0, 0, this.dynamicCanvas.width, this.dynamicCanvas.height);
                            this.clearStaticObjects();
        
                        }
                    }
        
                    zoomHack();   
                }
            }
        }
    });

    option9.addEventListener("click", () => {
        if (able_to_click_hack){
            window.location.href = "https://google.com";
        }
    });

    option10.addEventListener("click", () => {
        if (able_to_click_hack){
            if (!no_confirms_in_hack){
                alert('only in main menu or on load menu. While you play game not work.');
                setInterval(function () {
                    startBonus = 1;
                }, 15);
            } else {
                setInterval(function () {
                    startBonus = 1;
                }, 15);
            }
        }
    });

    option12.addEventListener("click", () => {
        if (able_to_click_hack){
            option12.style.backgroundColor = "white";
            option2.style.color = "black";
            let hp = prompt('enter your hp: ');
            if (hp !== null){
                setInterval(()=>{
                    game['me']['hp'] = hp;
                }, 1);
            }
        }
    });

    option13.addEventListener("click", () => {
        if (able_to_click_hack){
            option13.style.backgroundColor = "white";
            option2.style.color = "black";
            if (!no_confirms_in_hack){
                if (confirm("this is can will broke your game. Are you sure want?")){
                    let height = prompt('Enter your height: ');
                    if (height !== null){
                        game['me']['height'] = height;
                    }
                }
            } else {
                let height = prompt('Enter your height: ');
                if (height !== null){
                    game['me']['height'] = height;
                }
            }
        }
    });

    option14.addEventListener("click", () => {
        if (able_to_click_hack){
            option14.style.backgroundColor = "white";
            option2.style.color = "black";
            let nick_hack = prompt('Enter your nickname: ');
            game['me']['nick'] = `\x20${nick_hack}`;
        }
    });

    option15.addEventListener("click", () =>{
        if (able_to_click_hack){
            option15.style.backgroundColor = "white";
            setInterval(() => {
                game['me']['premium'] = true;
            }, 15);
        }
    });

    option16.addEventListener("click", () =>{
        if (able_to_click_hack){
            print();
        }
    });

    option17.addEventListener("click", () =>{
        if (able_to_click_hack){
            window.open("https://www.userscript.zone/search?q=https%3A%2F%2Fevoworld.io%2F&utm_campaign=dhdg&utm_medium=api&utm_source=usz");
        }
    });

    option19.addEventListener("click", () => {
        if (able_to_click_hack){
            option19.style.backgroundColor = "white";
            option2.style.color = "black";
            game.maxInterpolateDistanceTeleport = 3500;
        }
    });

    option20.addEventListener("click", () => {
        if (able_to_click_hack){
            let title = prompt("Enter Your Title: ");
            document.title = title;
        }
    });

    option21.addEventListener("click", () => {
        if (able_to_click_hack){
            scanPlayers();
        }
    });

    option22.addEventListener("click", () => {
        if (able_to_click_hack){
            option22.style.backgroundColor = "white";
            option2.style.color = "black";
            game['me']['level'] = 999;
            game['me']['nick'] = '\x20[Admin]';
        }
    });

    let clicked_hack_on_option_24 = 0;

    option24.addEventListener("click", () => {
        if (able_to_click_hack) {
            clicked_hack_on_option_24 += 1;
            if (clicked_hack_on_option_24 === 1){
                let text = prompt("Enter Your Text: ");
                let size = prompt("Enter text size: ");
                let color = prompt("Enter text color: ");
                if (text !== null && size !== null && color !== null){
                    let label = document.createElement("div");
                    label.id = 'hack_text_1'
                    label.textContent = text;
                    label.style.position = "fixed";
                    label.style.top = "10%";
                    label.style.left = "18%";
                    label.style.fontSize = `${size}px`;
                    label.style.fontFamily = "Arial";
                    label.style.color = `${color}`;
                    label.style.zIndex = 9998;
                    document.body.appendChild(label);
                }
            } else {
                let text = prompt("Enter Your Text: ");
                let size = prompt("Enter text size: ");
                let color = prompt("Enter text color: ");
                if (text !== null && size !== null && color !== null){
                    let label = document.createElement("div");
                    label.id = `hack_text_${clicked_hack_on_option_24}`;
                    label.textContent = text;
                    label.style.position = "fixed";
                    label.style.top = `${10 * clicked_hack_on_option_24 - 7}%`;
                    label.style.left = "18%";
                    label.style.fontSize = `${size}px`;
                    label.style.fontFamily = "Arial";
                    label.style.color = `${color}`;
                    label.style.zIndex = 9999;
                    document.body.appendChild(label);
                }
            }
        }
    });

    option25.addEventListener("click", () => {
        if (able_to_click_hack){
            game.me.name = 'reaper';
        }
    });

    option26.addEventListener("click", () => {
        if (able_to_click_hack){
            let key = prompt("enter a key to bind(will work on hack menu only): ");
            let hack = prompt('enter a hack(See hack id, to do it just press F12 and find hack HTML tag(to find true html you must to find hack name in html code, examples: <div id="sky-bs-mod-hack">sky bs mod </div>) and you must copy this id(without "") and enter to this alert field): ');
            if (hack !== null){
                if (!no_confirms_in_hack){
                    if (confirm('are you sure want to add keybind?')){
                        document.addEventListener("keydown", (event) => {
                            if (event.key === key){
                                if (cheatMenu.style.opacity !== 1){
                                    try{
                                        let option = document.getElementById(hack);
                                        able_to_click_hack = true;
                                        option.click();
                                        able_to_click_hack = false;
                                    } catch (e){
                                        alert("hack not found :( Please, check hack name.");
                                    }
                                } else {
                                    try{
                                        let option = document.getElementById(hack);
                                        option.click();
                                    } catch (e) {
                                        alert("hack not found :( Please, check hack name.");
                                    }
                                }
                            }
                        });
                    } else {
                        console.log('ok..');
                    }
                }
            } else {
                document.addEventListener("keydown", (event) => {
                    if (event.key === key){
                        if (cheatMenu.style.opacity !== 1){
                            try{
                                let option = document.getElementById(hack);
                                able_to_click_hack = true;
                                option.click();
                                able_to_click_hack = false;
                            } catch (e){
                                alert("hack not found :( Please, check hack name.");
                            }
                        } else {
                            try{
                                let option = document.getElementById(hack);
                                option.click();
                            } catch (e) {
                                alert("hack not found :( Please, check hack name.");
                            }
                        }
                    }
                });
            }
        }
    });

    option28.addEventListener("click", () => {
        if (able_to_click_hack){
            // const i_am_dead_interval = setInterval(() => {
            //     joinedGame = true;
            //     imDead = true;
            // }, 15);

            // setTimeout(() => {
            //     // plug
            // }, 250);

            // if (joinedGame && imDead){
            playAgain();
            //     clearInterval(i_am_dead_interval);
            // }

            alert("this works only when you died.");
        }
    });

    option30.addEventListener('click', () => {
        if (able_to_click_hack){
            setInterval(()=>{
                playAgain(); 
            }, 250);
        }
    });

    option31.addEventListener('click', () => {
        if (able_to_click_hack){
            let label_num_hack = prompt('Enter the label number to delete: ');
            let need_label = document.getElementById(`hack_text_${label_num_hack}`);
            if (need_label) {
                need_label.remove();
                clicked_hack_on_option_24 -= 1;
            } else {
                alert('Label not found!');
            }
        }
    });

    option33.addEventListener("click", () => {
        if (able_to_click_hack){
            if (!no_confirms_in_hack){
                if (confirm('Are you sure want to run this hack? You can will get ban and your screen can will be black!')){
                    const removeDarkness = () => {
                        if (window?.drawDarkness) {
                            window.drawDarkness = function () {

                            };
                            console.log("Darkness removed");
                        }
                    };

                    const interval = setInterval(() => {
                        if (window?.wasSocketInit && window?.joinedGame && !window?.imDead) {
                            removeDarkness();
                        }
                    }, 500);

                    const observer = new MutationObserver(() => {
                        removeDarkness();
                    });

                    observer.observe(document, { childList: true, subtree: true });
                }
            } else {
                const removeDarkness = () => {
                    if (window?.drawDarkness) {
                        window.drawDarkness = function () {

                        };
                        console.log("Darkness removed");
                    }
                };

                const interval = setInterval(() => {
                    if (window?.wasSocketInit && window?.joinedGame && !window?.imDead) {
                        removeDarkness();
                    }
                }, 500);

                const observer = new MutationObserver(() => {
                    removeDarkness();
                });

                observer.observe(document, { childList: true, subtree: true });
            }
        }
    });

    option34.addEventListener('click', () => {
        if (able_to_click_hack){
            let fps_hack = prompt("enter your fps(maybe not work. On old pc or old browsers this is a visual): ");
            if (fps_hack !== null){
                // setInterval(() => {
                //     game.fps = fps_hack;
                // }, 15);
                
                setInterval(()=>{
                    game.fpsTimes.length = fps_hack
                }, 15);
            }
        }
    });

    option35.addEventListener('click', () => {
        if (able_to_click_hack){
            game.me.zIndex = 9999;
            setInterval(()=>{game.me.inHide = false}, 15);
        }
    });

    option36.addEventListener('click', () => {
        if (able_to_click_hack){
            if (no_confirms_in_hack){
                const zIndexInfinite = (value) => {
                    petFunc(value);
                    if (value?.type === 1 || value?.type === 3) {
                        value.zIndex = 999;
                        setInterval(()=>{value.inHide = false}, 15);
                    }
                }

                if (window?.objectHandlerFunc_PLAYER) {
                    objectHandlerFunc_PLAYER = zIndexInfinite;
                }
            }else{
                if(confirm("visit authour's script page on greasy fork?")){
                    window.open("https://greasyfork.org/ru/scripts/457502-evoworld-io-cheats");
                }
                if(confirm("Your screen can will be black! Are you sure want to run it?")){
                    const doesntHidePlayersFunc = (value) => {
                        petFunc(value);
                        if (value?.type === 1 || value?.type === 3) {
                            value.zIndex = 999;
                            setInterval(()=>{value.inHide = false}, 15);
                        }
                    }
    
                    if (window?.objectHandlerFunc_PLAYER) {
                        objectHandlerFunc_PLAYER = doesntHidePlayersFunc;
                    }
                }
            }
        }
    });

    option37.addEventListener('click', () => {
        if (able_to_click_hack){
            if (no_confirms_in_hack){
                setInterval(() => {
                    adblockDisabled = true;
                }, 1);
            }else{
                alert("This on some functions not work but you can test it.");
                setInterval(() => {
                    adblockDisabled = true;
                }, 1);
            }
        }
    });

    option38.addEventListener('click', () => {
        if (able_to_click_hack){
            alert('this work only on my discord server version! https://discord.gg/BkVQRyjHq3');
            if (confirm('join discord server to get full?')){window.open('https://discord.gg/BkVQRyjHq3')};
        }
    });

    author_anothers_hacks.addEventListener("click", () => {
        if (able_to_click_hack){
            window.open("https://greasyfork.org/ru/users/1087245-chyppitaucoder");
        }
    });
}


// steal my code, steal. I'm not bothering you. I also once stole code from some people, sometimes stealing code is a good start for a career as a programmer. Look at this hack and code. What you think? Yes, I too sometime stole code, even now I sometimes stealing code when I don't know somethink.
