// ==UserScript==
// @name         Cirlz Style Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A script that can change the styles in cirlzgame.tk
// @author       FireTruck
// @match        http://cirlzgame.tk/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cirlzgame.tk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443716/Cirlz%20Style%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/443716/Cirlz%20Style%20Script.meta.js
// ==/UserScript==

var styles = `

#chat_textbox:hover {
    transition: all .5s ease-in-out;
    position: absolute;
    z-index: 1;
    bottom: 10px;
    background: #212121;
    border: 3px solid #AAFF00;
    border-radius: 5px;
    outline: none;
    color: #ffffff;
    height: 30px;
    text-indent: 12px;
    left: 10px;
    width: 300px;
    font-family: "Ubuntu";
}

#chat_textbox:focus {
    transition: all .5s ease-in-out;
    position: absolute;
    z-index: 1;
    bottom: 10px;
    background: #212121;
    border: 3px solid #AAFF00;
    border-radius: 5px;
    outline: none;
    color: #ffffff;
    height: 30px;
    text-indent: 12px;
    left: 10px;
    width: 300px;
    font-family: "Ubuntu";
}

#chat_textbox {
    transition: all .5s ease-in-out;
    position: absolute;
    z-index: 1;
    bottom: 10px;
    background: #212121;
    border: 3px solid #333333;
    border-radius: 5px;
    outline: none;
    color: #ffffff;
    height: 30px;
    text-indent: 12px;
    left: 10px;
    width: 300px;
    font-family: "Ubuntu";
}

#nick:hover {
    transition: all .5s ease-in-out;
    width: 105%;
    height: 37px;
    background: transparent;
    color: #AAFF00;
    border: 2px solid #AAFF00;
    transform: translate(-2%, -150%);
    font-family: 'Ubuntu', sans-serif;
}

#nick:focus {
    transition: all .5s ease-in-out;
    width: 105%;
    height: 37px;
    background: transparent;
    color: #AAFF00;
    border: 2px solid #AAFF00;
    transform: translate(-2%, -150%);
    font-family: 'Ubuntu', sans-serif;
}

#nick {
    transition: all .5s ease-in-out;
    width: 105%;
    height: 37px;
    background: transparent;
    color: white;
    border: 2px solid #AAFF00;
    transform: translate(-2%, -150%);
    font-family: 'Ubuntu', sans-serif;
}

#gigasplit:hover {
    transition: all .5s ease-in-out;
    width: 109%;
    margin-bottom: 10px;
    height: 40px;
    background: #202020;
    border: 2px solid #AAFF00;;
    color: #AAFF00;
    border-radius: 5px;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(-4%, 1150%);
    font-size: 16px;
    font-weight: bold;
}

#gigasplit {
    transition: all .5s ease-in-out;
    width: 109%;
    margin-bottom: 10px;
    height: 40px;
    background: #202020;
    border: 2px solid #AAFF00;
    border-radius: 5px;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(-4%, 1150%);
    font-size: 16px;
    font-weight: bold;
}

#settings-btn {
    transition: all .5s ease-in-out;
    background: #202020;
    border: 2px solid #AAFF00;
    border-radius: 5px;
    width: 51%;
    height: 36px;
    float: right;
    top: 0;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(-100%, -220%);
}

#settings-btn:hover {
    transition: all .5s ease-in-out;
    background: #202020;
    border: 2px solid #AAFF00;
    border-radius: 5px;
    color: #AAFF00;
    width: 51%;
    height: 36px;
    float: right;
    top: 0;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(-100%, -220%);
}

#play-btn {
    transition: all .5s ease-in-out;
    width: 105%;
    margin-bottom: 10px;
    background: #202020;
    border: 2px solid #AAFF00;
    border-radius: 5px;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(-2%, 120%);
    font-size: 16px;
    font-weight: bold;
}

#play-btn:hover {
    transition: all .5s ease-in-out;
    width: 105%;
    margin-bottom: 10px;
    background: #202020;
    border: 2px solid #AAFF00;
    border-radius: 5px;
    color: #AAFF00;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(-2%, 120%);
    font-size: 16px;
    font-weight: bold;
}

#spectate-btn {
    transition: all .5s ease-in-out;
    background: #202020;
    border: 2px solid #AAFF00;
    width: 52%;
    border-radius: 5px;
    float: right;
    top: 0;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(5%, -120%);
}

#spectate-btn:hover {
    transition: all .5s ease-in-out;
    background: #202020;
    border: 2px solid #AAFF00;
    width: 52%;
    border-radius: 5px;
    color: #AAFF00;
    float: right;
    top: 0;
    font-family: 'Ubuntu', sans-serif;
    transform: translate(5%, -120%);
}

#helloDialog {
    width: 400px;
    background-color: #fff;
    margin: 10px auto;
    border-radius: 5px;
    padding: 5px 15px 5px 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #AAFF00;
    background: #212121;
}

#ad {
    border: 2px solid #AAFF00;
    height: 260px;
    width: 90%;
}

`

var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);