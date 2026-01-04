// ==UserScript==
// @name         Tests
// @version      1.0
// @description  better experience
// @author       wuuu
// @match        https://ti.dxe.pl/testy/inf02/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dxe.pl
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1313060
// @downloadURL https://update.greasyfork.org/scripts/497150/Tests.user.js
// @updateURL https://update.greasyfork.org/scripts/497150/Tests.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const answers = {
        "eaf23840cf291d80ab64ba57d17cff9cccdf1b36": 1,
        "05267819830d0c76c39ac97e80e97c75419522fd": 2,
        "801c02cfce79c3e1d83c4ac07e0c902a0900b13a": 3,
        "ec3da09825e699c34d9af6b37bbf116edd21bec1": 4
    }

    newStyle();

    document.querySelectorAll("input[type='radio']").forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.timeoutId) {
                clearTimeout(radio.timeoutId);
            }

            radio.timeoutId = setTimeout(() => {
                const parentDiv = radio.closest('#pytanie');

                const hiddenInput = parentDiv.querySelector("input[type='hidden']");
                if (hiddenInput) {
                    const answerValue = answers[hiddenInput.value];
                    if (radio.value == answerValue) {
                        radio.style.backgroundColor = "green";
                    } else {
                        radio.style.backgroundColor = "red";
                    }
                }
            }, 5000);
        });
    });

})();

function newStyle() {
    GM_addStyle(`
        body {
            background-color: #121212;
            color: #ffffff;
            font-family: 'Roboto', sans-serif;
        }

        a.ponownie {
            text-decoration: none;
            color: #BB86FC;
            transition: color 0.3s;
        }

        a.ponownie:hover {
            color: #03DAC5;
        }

        #pytanie {
            border: 2px solid #BB86FC;
            border-radius: 4px;
            background-color: #1E1E1E;
            padding: 10px;
            margin-bottom: 20px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        }

        img {
            margin-bottom: 8px;
            border: 2px solid #3E3E3E;
            border-radius: 4px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
        }

        input {
            color: #ffffff;
            background-color: #333333;
            border: 1px solid #BB86FC;
            border-radius: 4px;
            padding: 5px;
        }

        input[type='radio'] {
            appearance: none;
            background-color: #1E1E1E;
            border: 1px solid #BB86FC;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            outline: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        input[type='radio']:checked {
            background-color: #BB86FC;
        }

        h4 {
            background-color: #333333;
            padding: 10px;
            margin: 0px;
            border-bottom: 2px dashed #3E3E3E;
            border-radius: 4px 4px 0 0;
        }

        h3 {
            font-family: 'Roboto', sans-serif;
            color: #BB86FC;
        }

        #p a {
            margin-right: 20px;
            text-decoration: none;
            color: #BB86FC;
            font-weight: bold;
            transition: color 0.3s;
        }

        #p a:hover {
            color: #03DAC5;
        }

        #p {
            text-align: center;
        }

        #photo {
            text-align: center;
        }
  `);
}