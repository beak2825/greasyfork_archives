// ==UserScript==
// @name			★Moomoo.io Snowflakes Working! 2021
// @version			1.0
// @description		Snowflakes!
// @author			Wynd
// @match			*://moomoo.io/*
// @grant			none
// @namespace       https://greasyfork.org/en/users/855407-xplasmicc
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437297/%E2%98%85Moomooio%20Snowflakes%20Working%21%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/437297/%E2%98%85Moomooio%20Snowflakes%20Working%21%202021.meta.js
// ==/UserScript==

(function() {
    const amount = 10; //Change Amount to you liking!

    const container = document.createElement("div");
    container.id = "snowContainer"
    document.body.appendChild(container);

    const styles = document.createElement("style");
    styles.type = "text/css";
    styles.innerHTML = `#snowContainer{position:absolute;left:0;top:0;bottom:0;right:0;width:100vw;height:100vh;background:transparent;pointer-events:none;z-index:10;}.snowflake {color: transparent;font-size: 3em;font-family: Arial, sans-serif;text-shadow: 0 0 6px #fff;}@-webkit-keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@-webkit-keyframes snowflakes-shake{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}50%{-webkit-transform:translateX(80px);transform:translateX(80px)}}@keyframes snowflakes-fall{0%{top:-10%}100%{top:100%}}@keyframes snowflakes-shake{0%,100%{transform:translateX(0)}50%{transform:translateX(80px)}}.snowflake{position:fixed;top:-10%;z-index:9999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;-webkit-animation-name:snowflakes-fall,snowflakes-shake;-webkit-animation-duration:10s,3s;-webkit-animation-timing-function:linear,ease-in-out;-webkit-animation-iteration-count:infinite,infinite;-webkit-animation-play-state:running,running;animation-name:snowflakes-fall,snowflakes-shake;animation-duration:10s,3s;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite;animation-play-state:running,running}.snowflake:nth-of-type(0){left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s}.snowflake:nth-of-type(1){left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s}.snowflake:nth-of-type(2){left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s}.snowflake:nth-of-type(3){left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s}.snowflake:nth-of-type(4){left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s}.snowflake:nth-of-type(5){left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s}.snowflake:nth-of-type(6){left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s}.snowflake:nth-of-type(7){left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s}.snowflake:nth-of-type(8){left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s}.snowflake:nth-of-type(9){left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s}.snowflake:nth-of-type(10){left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s}.snowflake:nth-of-type(11){left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s}`
    document.body.appendChild(styles);

    for(let i = 0; i < amount; i++){
        createSnowflake();
        let d = ~~(Math.random() * 5);
        styles.sheet.insertRule('.snowflake:nth-of-type('+ i +'){left:' + ~ ~(Math.random() *100) + '%;-webkit-animation-delay:' + d + 's,' + d + 's;animation-delay:' + d + 's,' + d + 's}');
    }

    function createSnowflake(){
        const txt = ["❅","❆"]
        let snow = document.createElement("div");
        snow.innerText = txt[+(Math.random()>.5)];
        container.appendChild(snow);
        snow.classList.add('snowflake');
    }
})();