// ==UserScript==
// @name             One-click add All LinkedIn People
// @description      One-click add all LinkedIn "Recommended for you" people in the My Network page
// @namespace        nickpapoutsis
// @author           nickpapoutsis
// @copyright        2020, nickpapoutsis (https://openuserjs.org/users/nickpapoutsis)
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A6EL76QADA2YY&source=url
// @license          MIT
// @include          https://www.linkedin.com/*
// @version          0.9
// @grant            none
// @icon             data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/28565/One-click%20add%20All%20LinkedIn%20People.user.js
// @updateURL https://update.greasyfork.org/scripts/28565/One-click%20add%20All%20LinkedIn%20People.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self == window.top){
        createButton();
        createPopup();
    }//this makes sure we don't create extra buttons inside iframes, ads, etc

    function createButton() {

        let div = document.createElement('div');
        div.innerHTML = '<a id="connectBtn">Connect!</a>';

        div.style.display = "inline-block";
        div.style.position = "fixed";
        div.style.right = "3em";
        div.style.top = "5em";
        div.style.zIndex = '995';
        div.style.cursor = 'pointer';

        document.body.append(div);

        let btn = document.getElementById('connectBtn');

        btn.style.background = 'white';
        btn.style.color = 'blue';
        btn.style.fontWeight = '800';
        btn.style.padding = '5px';
        btn.style.border = 'solid 2px black';
        btn.style.borderRadius = '7px';
        btn.style.textDecoration = 'none';
        btn.style.fontSize = '0.8em';

        document.getElementById('connectBtn').addEventListener('click', clicked, false);
    }

    function createPopup() {

        let div = document.createElement('div');
        div.innerHTML = '<a id="popup">This button works on the "My Network" section only</a>';

        div.style.display = "none";
        div.style.position = "fixed";
        div.style.right = "3em";
        div.style.top = "7.5em";
        div.style.zIndex = '996';
        div.style.cursor = 'pointer';

        document.body.append(div);

        let btn = document.getElementById('popup');

        btn.style.background = 'palevioletred';
        btn.style.color = 'white';
        btn.style.marginTop = '0.5em';
        btn.style.padding = '4px';
        btn.style.borderRadius = '7px';
        btn.style.textDecoration = 'none';
        btn.style.fontSize = '1em';
    }

    function clicked() {

        if (location.pathname.split('/')[1].toLowerCase() === 'mynetwork'){
            buttonClickAction();
        } else {
            var btn = document.getElementById('popup').parentNode;
            btn.style.display = "block";
            setTimeout(function() {
                btn.style.display = "none";
            }, 4000)
        }
    }


    function buttonClickAction() {

        let btn = document.getElementById('connectBtn');
        btn.style.background = 'gray';
        btn.style.color = 'white';
        // flashes color on click
        setTimeout(function() {
            btn.style.background = 'white';
            btn.style.color = 'blue';
        }, 300)

        //finds the buttons and performs the clicking
        if (document.querySelectorAll('[data-control-name=invite]')) {
            var x = document.querySelectorAll('[data-control-name=invite]');
            for (let i = 0; i < x.length; i++) {
                x[i].click();
                console.log(x[i].getAttribute("aria-label"));
            }
        }
        // else {
        //     x = document.getElementsByClassName("js-mn-discovery-person-card__action-btn");
        //     for (let j = 0; j < x.length; j++) {
        //         x[j].click();
        //     }
        // }
    }
})();
