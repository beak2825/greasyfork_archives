// ==UserScript==
// @name         kawaiimoji
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  press button to convert lower case letter to any characters on any senpai clients
// @author       #kawaiirz
// @match        http://caffe.senpai-agar.online/
// @match        http://caffe.senpai-agar.online/lwga/
// @match        http://ixagar.net/
// @match        http://ixagar.net/classic/
// @match        http://senpai-agar.online/
// @match        http://senpai-agar.online/lwga/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/412058/kawaiimoji.user.js
// @updateURL https://update.greasyfork.org/scripts/412058/kawaiimoji.meta.js
// ==/UserScript==

(function t() {
    // if (target == false), restart this function.
    var target = document.getElementsByClassName('chat_input_area')[0]; //lwga
    if (!target) {
        target = document.getElementById('chatboxArea2'); // classic
        if (!target) {
            setTimeout(t, 1000);
            return;
        }
    }

    // charactes
    var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
        minimoji = ['ᴀ','ʙ','ᴄ','ᴅ','ᴇ','ғ','ɢ','ʜ','ɪ','ᴊ','ᴋ','ʟ','ᴍ','ɴ','ᴏ','ᴘ','ǫ','ʀ','s','ᴛ','ᴜ','ᴠ','ᴡ','x','ʏ','ᴢ'];
    var alphanumeric = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',0,1,2,3,4,5,6,7,8,9],
        morseCode = ['.-','-...','-.-.','-..','.','..-.','--.','....','..','.---','-.-','.-..','--','-.','---','.--.','--.-','.-.','...','-','..-','...-','.--','-..-','-.--','--..','-----','.----','..---','...--','....-','.....','-....','--...','---..','----.'],
        marumoji = ['🅐','🅑','🅒','🅓','🅔','🅕','🅖','🅗','🅘','🅙','🅚','🅛','🅜','🅝','🅞','🅟','🅠','🅡','🅢','🅣','🅤','🅥','🅦','🅧','🅨','🅩','⓿','➊','➋','➌','➍','➎','➏','➐','➑','➒'];
    var nums = [0,1,2,3,4,5,6,7,8,9],
        mininums = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];

    var btnChar = ['ᴀ','₁','🅐','.','.'];

    // button configuration
    var btn = [];
    for (var bn=0; bn<btnChar.length; bn++) {
        btn[bn] = target.appendChild(document.createElement('div'));
        btn[bn].setAttribute("className", 'kawaiibtn');
        btn[bn].innerText = btnChar[bn];
        if (bn == 4) btn[bn].style.textDecoration ='line-through';
        btn[bn].style.fontSize = 'small';
        btn[bn].style.color = 'black';
        btn[bn].style.backgroundColor = 'whitesmoke';
        btn[bn].style.cursor = 'pointer';
        btn[bn].style.borderTop = 'solid 1px black';
        btn[bn].style.borderRight = 'solid 1px black';
        btn[bn].style.zIndex = 1;
        btn[bn].style.position = 'absolute';
        btn[bn].style.padding = '2px 8px 3px 7px';
        btn[bn].style.float = 'left';
        btn[bn].style.position = 'static';
    }

    var chatBox = target.className == 'chat_input_area' ? document.getElementById('chat_input_text_box') : document.getElementById('input_box2');

    btn[0].addEventListener('click', function() {
        var afterStrs = [];
        if (chatBox) {
            var chatBoxStr = chatBox.value,
                beforeStrs = chatBoxStr.split('');
            for (var i=0; i<beforeStrs.length; i++) {
                for (var ii=0; ii<alphabets.length; ii++) {
                    if (beforeStrs[i] == alphabets[ii]) {
                        afterStrs[i] = minimoji[ii];
                        break;
                    } else {
                        afterStrs[i] = beforeStrs[i];
                    }
                }
            }
            chatBox.value = afterStrs.join('');
        }
    }, false);
    btn[1].addEventListener('click', function() {
        var afterStrs = [];
        if (chatBox) {
            var chatBoxStr = chatBox.value,
                beforeStrs = chatBoxStr.split('');
            for (var i=0; i<beforeStrs.length; i++) {
                for (var ii=0; ii<nums.length; ii++) {
                    if (beforeStrs[i] == nums[ii]) {
                        afterStrs[i] = mininums[ii];
                        break;
                    } else {
                        afterStrs[i] = beforeStrs[i];
                    }
                }
            }
            chatBox.value = afterStrs.join('');
        }
    }, false);
    btn[2].addEventListener('click', function() {
        var afterStrs = [];
        if (chatBox) {
            var chatBoxStr = chatBox.value,
                beforeStrs = chatBoxStr.split('');
            for (var i=0; i<beforeStrs.length; i++) {
                for (var ii=0; ii<alphanumeric.length; ii++) {
                    if (beforeStrs[i] == alphanumeric[ii]) {
                        afterStrs[i] = marumoji[ii];
                        break;
                    } else {
                        afterStrs[i] = beforeStrs[i];
                    }
                }
            }
            chatBox.value = afterStrs.join('');
        }
    }, false);
    btn[3].addEventListener('click', function() {
        var afterStrs = [];
        if (chatBox) {
            var chatBoxStr = chatBox.value,
                beforeStrs = chatBoxStr.split('');
            for (var i=0; i<beforeStrs.length; i++) {
                for (var ii=0; ii<alphanumeric.length; ii++) {
                    if (beforeStrs[i] == alphanumeric[ii]) {
                        afterStrs[i] = morseCode[ii];
                        break;
                    } else {
                        afterStrs[i] = beforeStrs[i];
                    }
                }
            }
            chatBox.value = afterStrs.join(' ');
        }
    }, false);
    btn[4].addEventListener('click', function() {
        var afterStrs = [];
        if (chatBox) {
            var chatBoxStr = chatBox.value,
                beforeStrs = chatBoxStr.split(' ');
            for (var i=0; i<beforeStrs.length; i++) {
                for (var ii=0; ii<alphanumeric.length; ii++) {
                    if (beforeStrs[i] == morseCode[ii]) {
                        afterStrs[i] = alphanumeric[ii];
                        break;
                    } else {
                        afterStrs[i] = beforeStrs[i];
                    }
                }
            }
            chatBox.value = afterStrs.join('');

            var chatDOM = document.getElementById('chat_view').children;
            var chatTexts = [];
            var cnt = 0;
            for (var il = (chatDOM.length - 1); il>=0; il--) {
                cnt++;
                if (cnt > 6) {
                    break;
                }
                chatTexts[il] = chatDOM[il].lastElementChild.textContent;
                console.log(chatTexts[il]);

                beforeStrs = [], afterStrs = [];
                beforeStrs = chatTexts[il].split(' ');
                for (i=0; i<beforeStrs.length; i++) {
                    for (ii=0; ii<alphanumeric.length; ii++) {
                        if (beforeStrs[i] == morseCode[ii]) {
                            afterStrs[i] = alphanumeric[ii];
                            break;
                        } else {
                            afterStrs[i] = beforeStrs[i];
                        }
                    }
                }

                chatDOM[il].lastElementChild.textContent = afterStrs.join('');
            }
        }
    });

    // button observer configuration
    var conf = {
        attributes: true
    }

    // synchronize chatbox and button styles.display
    const observer = new MutationObserver (function(record) {
        for (var i=0; i<btnChar.length; i++) {
            target.style.display == 'none' ? btn[i].style.display = 'none' : btn[i].style.display = 'block'
        }
	});
	observer.observe(target, conf);
})();