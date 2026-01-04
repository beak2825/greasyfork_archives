// ==UserScript==
// @name         Quick link(快速連結)中文版
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  deadfrontier-This is a convenience button script
// @author       SHUNHK
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        *fairview.deadfrontier.com/onlinezombiemmo/
// @icon         https://i.imgur.com/WKv8txW.jpeg
// @license      LGPL License
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/512385/Quick%20link%28%E5%BF%AB%E9%80%9F%E9%80%A3%E7%B5%90%29%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512385/Quick%20link%28%E5%BF%AB%E9%80%9F%E9%80%A3%E7%B5%90%29%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script started');

    //
    var container = createButtonContainer();
    document.body.appendChild(container);

    //
    function setCustomPosition(container) {
    if (window.innerWidth <= 960) { //
        container.style.top = '600px';
        container.style.right = '715px';
    } else { 
        container.style.top = '230px';
        container.style.right = '380px';
    }
}


setCustomPosition(container);


window.addEventListener('resize', function() {
    setCustomPosition(container);
});

    //
    addRainbowAnimation();

    function createButtonContainer() {
        var container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '200px'; //
        container.style.right = '380px'; //
        container.style.zIndex = '1000';
        container.style.backgroundImage = 'url("https://i.imgur.com/HW8B3sf.jpeg")';
        container.style.backgroundSize = 'cover';
        container.style.padding = '8px';
        container.style.borderRadius = '50px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';
        container.style.width = '60px'; //
        container.style.height = 'auto'; //

        console.log('Container created');


        var buttons = [
            { name: '快速旅行', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=61' },
            { name: '制作', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59' },
            { name: '賭博', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=49' },
            { name: '便利店', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84' },
            { name: '人物屬性', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile' },
            { name: '市場', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35' },
            { name: '銀行', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15' },
            { name: '倉庫', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50' },
            { name: '公園', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24' },
            { name: '內城', link: 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=0' },
        ];

        buttons.forEach(function(buttonInfo) {
            createQuickNavigationButton(container, buttonInfo.name, buttonInfo.link);
        });

        //
        createMoveButton(container);

        return container;
    }

    function createQuickNavigationButton(container, buttonTitle, url) {
        let button = document.createElement("button");
        button.textContent = buttonTitle;
        button.id = buttonTitle;
        button.style.height = "max-content";
        button.classList.add("nav-button");
        button.addEventListener("click", function() {
            window.location.href = url;
        });
        button.addEventListener('mouseover', function() {
            button.style.animation = 'rainbow 3s infinite';
        });
        button.addEventListener('mouseout', function() {
            button.style.animation = '';
        });
        container.appendChild(button);
    }

    function createMoveButton(container) {
        let moveButton = document.createElement("button");
        moveButton.textContent = "移動框架";
        moveButton.style.padding = '10px';
        moveButton.style.border = 'none';
        moveButton.style.borderRadius = '5px';
        moveButton.style.backgroundColor = '#28a745';
        moveButton.style.color = 'white';
        moveButton.style.cursor = 'pointer';
        moveButton.addEventListener('mousedown', function(e) {
            var offsetX = e.clientX - container.getBoundingClientRect().left;
            var offsetY = e.clientY - container.getBoundingClientRect().top;

            function mouseMoveHandler(e) {
                container.style.left = `${e.clientX - offsetX}px`;
                container.style.top = `${e.clientY - offsetY}px`;
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
        container.appendChild(moveButton);
    }

    function addRainbowAnimation() {
        var style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow {
                0% { background-color: red; }
                14% { background-color: orange; }
                28% { background-color: yellow; }
                42% { background-color: green; }
                57% { background-color: blue; }
                71% { background-color: indigo; }
                85% { background-color: violet; }
                100% { background-color: red; }
            }
            .rainbow-animation {
                animation: rainbow 3s infinite;
            }
            .move-button {
                padding: 10px;
                border: none;
                border-radius: 5px;
                background-color: #28a745;
                color: white;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }



})();
