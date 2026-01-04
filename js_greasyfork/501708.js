// ==UserScript==
// @name         Snay.io ++
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  some cool features
// @author       GravityG
// @match        https://www.snay.io/*
// @license      MIT
// @icon         https://i.postimg.cc/dtDCj3h6/Logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501708/Snayio%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/501708/Snayio%20%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createElementFromHTML(htmlString, id) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        var element = div.firstChild;
        element.id = id;
        return element;
    }

    var htmlStrings = [
        {html: '<h3 class="settings-subtitle" style="margin: 1em; padding: 0px; font-size: 2em;">Script Credits</h3>', id: 'newElement1'},
        {html: '<hr style="color: rgb(99, 99, 99); height: 0.1vw; background-color: rgb(99, 99, 99); width: 58em; margin-bottom: 1vw; margin-left: 2em;">', id: 'newElement2'},
        {html: '<li style="margin-right: 0.5em; margin-left: 0.5em; margin-bottom: 0.5em; padding: 0px; color: rgb(99, 99, 99); background-color: rgb(242, 242, 242); border: 0.05em solid rgb(211, 211, 211); border-radius: 0.5em; display: flex; align-items: center; width: 30em; height: 3em; font-size: 2em;"><img src="https://i.pinimg.com/originals/23/51/bc/2351bc65b2b5d75cef146b7edddf805b.gif" style="border-radius: 100%; margin-right: 0.5em; margin-left: 0.5em; width: 2.5em; height: 2.5em;"><span style="width: 14em;">GravityG </span><img src="/assets/img/DiscordIcone.png" style="margin-right: 0.5em; margin-left: 0.5em; width: 2.5em; height: 2.5em;"><span>hw_e</span></li>', id: 'newElement3'},
        {html: '<li style="margin-right: 0.5em; margin-left: 0.5em; margin-bottom: 0.5em; padding: 0px; color: rgb(99, 99, 99); background-color: rgb(242, 242, 242); border: 0.05em solid rgb(211, 211, 211); border-radius: 0.5em; display: flex; align-items: center; width: 30em; height: 3em; font-size: 2em;"><img src="/assets/img/Tester_1.png" style="border-radius: 100%; margin-right: 0.5em; margin-left: 0.5em; width: 2.5em; height: 2.5em;"><span style="width: 14em;">Shzm </span><img src="/assets/img/DiscordIcone.png" style="margin-right: 0.5em; margin-left: 0.5em; width: 2.5em; height: 2.5em;"><span>1tsj0el</span></li>', id: 'newElement4'}
    ];

    var settingsBtn = document.getElementById('settings-btn');

    settingsBtn.addEventListener('click', function() {
        var moreButtons = document.getElementById('MoreButtons');

        htmlStrings.reverse().forEach(function(elementData) {
            if (!document.getElementById(elementData.id)) {
                var newElement = createElementFromHTML(elementData.html, elementData.id);
                moreButtons.insertBefore(newElement, moreButtons.firstChild);
            }
        });
    });

    function applyCustomCSS() {
        var modMenu = document.getElementById('modmenu');
        if (modMenu) {
            modMenu.style.borderRadius = '15px';
            modMenu.style.zIndex = '20';
            modMenu.style.top = '1vw';
            modMenu.style.width = '20vw';
            modMenu.style.height = '30vw';
            modMenu.style.borderStyle = 'solid';
            modMenu.style.borderColor = 'transparent';
            modMenu.style.backgroundColor = 'rgb(34 34 34)';
            modMenu.style.position = 'absolute';
            modMenu.style.right = '1vw';

            var modMenuChildren = modMenu.querySelectorAll('*');
            modMenuChildren.forEach(function(child) {
                child.style.borderColor = 'transparent';
            });

            var modMenuInputs = modMenu.querySelectorAll('input');
            modMenuInputs.forEach(function(input) {
                input.style.width = '85%';
                input.style.position = 'relative';
                input.style.display = 'block';
                input.style.color = 'green';
                input.style.height = '0.2vw';
                input.style.marginTop = '2vw';
                input.style.marginBottom = '2vw';
                input.style.borderRadius = '1vw';
                input.style.borderColor = 'transparent';
            });

            var modMenuTitle = document.getElementById('modmenutitle');
            if (modMenuTitle) {
                modMenuTitle.style.fontSize = '1.8vw';
                modMenuTitle.style.fontWeight = 'bold';
                modMenuTitle.style.margin = '0';
                modMenuTitle.style.padding = '0';
                modMenuTitle.style.position = 'relative';
                modMenuTitle.style.display = 'block';
                modMenuTitle.style.height = '3vw';
                modMenuTitle.style.textAlign = 'center';
                modMenuTitle.style.color = 'white';
                modMenuTitle.style.zIndex = '-1';
                modMenuTitle.style.borderColor = 'transparent';
            }

            var modMenuSubtitles = document.querySelectorAll('.modmenusubtitle');
            modMenuSubtitles.forEach(function(subtitle) {
                subtitle.style.fontSize = '1.2vw';
                subtitle.style.position = 'relative';
                subtitle.style.display = 'block';
                subtitle.style.width = '100%';
                subtitle.style.height = '1vw';
                subtitle.style.textAlign = 'center';
                subtitle.style.color = 'white';
                subtitle.style.borderColor = 'transparent';
            });

            var modMenuValues = document.querySelectorAll('.modmenuvalue');
            modMenuValues.forEach(function(value) {
                value.style.position = 'relative';
                value.style.display = 'block';
                value.style.color = 'white';
                value.style.width = '15%';
                value.style.paddingTop = '0';
                value.style.fontSize = '2vw';
                value.style.lineHeight = '1vw';
                value.style.borderColor = 'transparent';
            });
        }
    }

    window.addEventListener('load', applyCustomCSS);

    var checkGameOver;

    document.getElementById('play-btn').addEventListener('click', function() {
        checkGameOver = setInterval(function() {
            var overlays = document.getElementById('overlays');
            if (overlays && overlays.classList.contains('fade-out')) {
                var gameOver = document.getElementById('game-over');
                var respawnButton = document.getElementById('respawn-button');
                var overlay = document.querySelector('.swal-overlay.swal-overlay--show-modal');
                var modal = overlay ? overlay.querySelector('.swal-modal') : null;
                var buttonContainers = modal ? modal.querySelectorAll('.swal-button-container') : [];
                var stopButton = buttonContainers.length > 1 ? buttonContainers[1].querySelector('.swal-button.swal-button--confirm.fs40.swal-button--danger') : null;

                if (gameOver && gameOver.style.display !== 'none' && respawnButton) {
                    respawnButton.click();
                }

                if (stopButton) {
                    clearInterval(checkGameOver);
                    stopButton.addEventListener('click', function() {
                        clearInterval(checkGameOver);
                    });
                }
            } else {
                clearInterval(checkGameOver);
            }
        }, 700);
    });

    document.getElementById('spectate-btn').addEventListener('click', function() {
        clearInterval(checkGameOver);
    });

    document.getElementById('settings-btn').addEventListener('click', function() {
        clearInterval(checkGameOver);

        // Your new code
        let element = document.getElementById('keys');

        if (element && document.getElementById('settings-content') && !document.getElementById('respawnKeybind')) {
            let newSpan = document.createElement('span');
            newSpan.textContent = 'Respawn';

            let newB = document.createElement('b');
            newB.textContent = localStorage.getItem('respawnKeybind') || 'V';
            newB.className = 'selectable';
            newB.id = 'respawnKeybind';

            element.insertBefore(newB, element.firstChild);
            element.insertBefore(newSpan, element.firstChild);

            let respawnKeybindElement = document.getElementById('respawnKeybind');

            respawnKeybindElement.addEventListener('mouseover', function() {
                window.onkeydown = function(event) {
                    event.preventDefault();

                    let key = event.key.toUpperCase();
                    respawnKeybindElement.textContent = key;

                    localStorage.setItem('respawnKeybind', key);
                };
            });

            respawnKeybindElement.addEventListener('mouseout', function() {
                window.onkeydown = null;
            });
        }
    });

function applyChanges() {
    var Background = localStorage.getItem('backgroundUrl') || 'url("https://images5.alphacoders.com/135/thumb-1920-1351143.png")';

    var logo = document.getElementById('title');
    if (logo) {
        logo.style.display = 'none';
    }

    var elements = ['seasons', 'store', 'account', 'gallery', 'settings', 'overlays', 'players', 'leaderboards'];

    elements.forEach(function(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.style.backgroundImage = Background;
        }
    });
}

window.onload = function() {
    applyChanges();

    var button = document.querySelector('.bgset-button');

    button.addEventListener('click', function() {
        var input = document.getElementById('uniqueInputId');

        var newBackgroundUrl = 'url("' + input.value + '")';

        localStorage.setItem('backgroundUrl', newBackgroundUrl);

        applyChanges();
    });
};

var style = document.createElement('style');
style.innerHTML = `
  .bgset-button {
    border-radius: 10%;
    margin-left: 0.5em;
    padding: 0.1em;
    border: none;
    background-color: #3c3c3c;
    color: #dd255b;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 55%;
    transition-duration: 0.4s;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

var checkElement = setInterval(function() {
    if (!document.querySelector("#bgset")) {
        var parentElement = document.querySelector("#Settings-quality > ul");

        var newElement = document.createElement("li");
        newElement.setAttribute("style", "margin-right: 0.5em; margin-bottom: 0.5em; padding: 0px; color: rgb(99, 99, 99); background-color: rgb(242, 242, 242); border: 0.05em solid rgb(211, 211, 211); border-radius: 0.5em; display: flex; align-items: center; width: 30em; height: 2em; font-size: 2em;");
        newElement.setAttribute("id", "bgset");

        newElement.innerHTML = '<img src="https://i.imgur.com/CxuKkzK.pngg" style="margin-right: 0.5em; margin-left: 0.5em; width: 2em; height: 2em;"><span>Background</span> <div style="margin-left: auto; margin-right: 0.5em; display: flex; align-items: center; width: 10em;"><input id="uniqueInputId" class="input" type="text" style="order: 4; margin: 0em; padding: 0px;"><button class="bgset-button">Set Background</button></div>';

        parentElement.insertBefore(newElement, parentElement.firstChild);

        clearInterval(checkElement);
    }
}, 500);

    var observer3 = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                applyChanges();
            }
        });
    });

    observer3.observe(document, { childList: true, subtree: true });

    function removeAds() {
        let ads = document.querySelectorAll('.ads');
        ads.forEach(ad => ad.remove());
    }

    removeAds();

    let observer = new MutationObserver(removeAds);

    observer.observe(document, { childList: true, subtree: true });

    document.addEventListener('keydown', function(event) {
        let respawnKeybindElement = document.getElementById('respawnKeybind');

        if (respawnKeybindElement && event.key.toUpperCase() === respawnKeybindElement.textContent.toUpperCase()) {
            var leaveBtn = document.getElementById('leaveBtn');

            if (leaveBtn) {
                leaveBtn.click();
            }

            setTimeout(function() {
                var overlay1 = document.querySelector('.swal-overlay.swal-overlay--show-modal');
                var modal2 = overlay1 ? overlay1.querySelector('.swal-modal') : null;
                var buttonContainers3 = modal2 ? modal2.querySelectorAll('.swal-button-container') : [];
                var stopButton4 = buttonContainers3.length > 1 ? buttonContainers3[1].querySelector('.swal-button.swal-button--confirm.fs40.swal-button--danger') : null;

                if (stopButton4) {
                    stopButton4.click();
                }

                setTimeout(function() {
                    var playBtn = document.getElementById('play-btn');

                    if (playBtn) {
                        playBtn.click();
                    }
                }, 200);
            }, 200);
        }
    });

    var observer2 = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var video = document.querySelector('video');
                if (video) {
                    video.onloadedmetadata = function() {
                        video.currentTime = video.duration; // skip to the end of the video
                    };
                    video.onplay = function() {
                        if (video.currentTime < video.duration) {
                            video.currentTime = video.duration; // skip to the end of the video
                        }
                    };
                }
            }
        });
    });

    observer2.observe(document, { childList: true, subtree: true });

    var clientId = 'ddd0aefbd24c485';

    function createButton() {
        var btn = document.createElement('button');
        btn.id = 'imgur';
        btn.className = 'button-81';
        btn.style.borderRadius = '20px';
        btn.style.marginLeft = '0.5vw';
        btn.style.width = '7vw';
        btn.style.height = '7vw';
        btn.style.backgroundColor = 'transparent';
        btn.style.backgroundImage = 'url("https://play-lh.googleusercontent.com/pR3AhTl1bOz8anFPzWj3O6RucXldUqrhOQVkCRpnmtfVUcHiyPC_E4Yppb8s9GjGlg=w240-h480-rw")';
        btn.style.backgroundSize = '100% 100%';
        return btn;
    }

    function resizeImage(file, maxWidth, maxHeight, callback) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            var ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function(blob) {
                callback(blob);
            }, 'image/png');
        };
        img.src = URL.createObjectURL(file);
    }

    function uploadImage(file) {
        var formData = new FormData();
        formData.append('image', file);

        fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': 'Client-ID ' + clientId,
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var link = data.data.link;
                document.querySelector('#addVipSkin').value = link;
            }
        });
    }

    var createButtonInterval = setInterval(function() {
        var existingButton = document.querySelector("#gallery-body > div.vip-div > ul > li:nth-child(1) > button");

        if (existingButton) {
            existingButton.parentNode.insertBefore(createButton(), existingButton.nextSibling);
            clearInterval(createButtonInterval);
        }
    }, 1000);

    var McheckGameOver;

document.getElementById('play-btn').addEventListener('touchstart', function() {
    McheckGameOver = setInterval(function() {
        var overlays = document.getElementById('overlays');
        if (overlays && overlays.classList.contains('fade-out')) {
            var MgameOver = document.getElementById('game-over');
            var MrespawnButton = document.getElementById('respawn-button');
            var Moverlay = document.querySelector('.swal-overlay.swal-overlay--show-modal');
            var Mmodal = Moverlay ? Moverlay.querySelector('.swal-modal') : null;
            var MbuttonContainers = Mmodal ? Mmodal.querySelectorAll('.swal-button-container') : [];
            var MstopButton = MbuttonContainers.length > 1 ? MbuttonContainers[1].querySelector('.swal-button.swal-button--confirm.fs40.swal-button--danger') : null;

            if (MgameOver && MgameOver.style.display !== 'none' && MrespawnButton) {
                MrespawnButton.click();
            }

            if (MstopButton) {
                clearInterval(McheckGameOver);
                MstopButton.addEventListener('touchstart', function() {
                    clearInterval(McheckGameOver);
                });
            }
        } else {
            clearInterval(McheckGameOver);
        }
    }, 700);
});

document.getElementById('spectate-btn').addEventListener('touchstart', function() {
    clearInterval(McheckGameOver);
});

document.getElementById('settings-btn').addEventListener('touchstart', function() {
    clearInterval(McheckGameOver);
});

    var addButtonListenerInterval = setInterval(function() {
        var imgurButton = document.querySelector('#imgur');

        if (imgurButton) {
            imgurButton.addEventListener('click', function() {
                var input = document.createElement('input');
                input.type = 'file';
                input.accept = '.png'; // Only allow .png files

                input.addEventListener('change', function() {
                    var file = input.files[0]; // Get the selected file
                    if (file) {
                        resizeImage(file, 900, 900, function(resizedImage) {
                            uploadImage(resizedImage);
                        });
                    }
                });

                input.click();
            });

            clearInterval(addButtonListenerInterval);
        }
    }, 1000);
})();
