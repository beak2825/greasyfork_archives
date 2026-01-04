// ==UserScript==
// @name            hypothes.isFloatingButton
// @namespace       https://greasyfork.org/users/296362
// @version         240117a
// @author          Lancelotly.Sagirrarimeow
// @description     This is a shortcut for using hypothes.is service. It combines the hypothes.is bookmarklet to the page directly for a further convience.
// @match           *://*/*
// @exclude         https://hypothes.is/*
// @noframes
// @run-at          document-idle
// @grant           GM_addStyle
// @icon            data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjMgNzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTYzIDU4YTUgNSAwIDAgMSAtNSA1aC0xOWwtNy41IDEwLTcuOC0xMGgtMTguN2E1IDUgMCAwIDEgLTUtNXYtNTNhNSA1IDAgMCAxIDUtNWg1M2E1IDUgMCAwIDEgNSA1eiIgZmlsbD0iI2NlMjAyNyIvPjxnIGZpbGw9IiNmZmYiPjx0ZXh0IGZvbnQtZmFtaWx5PSJQVFNhbnMtQm9sZCwgUFQgU2FucyIgZm9udC1zaXplPSI1OC4xNSIgZm9udC13ZWlnaHQ9IjcwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy43NyA1Mi4zOSkiPmg8L3RleHQ+PGNpcmNsZSBjeD0iNDkuOTEiIGN5PSI0NyIgcj0iNSIvPjwvZz48L3N2Zz4=
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/382369/hypothesisFloatingButton.user.js
// @updateURL https://update.greasyfork.org/scripts/382369/hypothesisFloatingButton.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and positioned with CSS.*/
function buttonClickAction(t) {
    ! function () {
        window.hypothesisConfig = function () {
            return {
                showHighlights: !0
            }
        };
        var t = document,
            e = t.createElement("script");
        e.setAttribute("src", "https://hypothes.is/embed.js")
        t.body.appendChild(e)
    }()
}

function findMaxZindex() {
    const zIndexes = [];
    document
        .querySelectorAll("*")
        .forEach(el => {
            const zIndex = parseInt(window.getComputedStyle(el).zIndex, 10);
            if (!isNaN(zIndex)) {
                zIndexes.push(zIndex);
            }
        });
    return Math.max.apply(1, zIndexes);
}

var hNode = document.createElement("div"),
    z = findMaxZindex();
hNode.innerHTML = '<div id="fButton" data-toggle="tooltip" data-placement="left" data-original-title="Create"></div>'
hNode.style.zIndex = z + 1
hNode.setAttribute("id", "myFloatingButton")
document.body.appendChild(hNode)
document.getElementById("fButton").addEventListener("click", buttonClickAction, !1);

//--- Style our newly added elements using CSS.
GM_addStyle(`
#myFloatingButton {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNjMgNzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTYzIDU4YTUgNSAwIDAgMSAtNSA1aC0xOWwtNy41IDEwLTcuOC0xMGgtMTguN2E1IDUgMCAwIDEgLTUtNXYtNTNhNSA1IDAgMCAxIDUtNWg1M2E1IDUgMCAwIDEgNSA1eiIgZmlsbD0iI2NlMjAyNyIvPjxnIGZpbGw9IiNmZmYiPjx0ZXh0IGZvbnQtZmFtaWx5PSJQVFNhbnMtQm9sZCwgUFQgU2FucyIgZm9udC1zaXplPSI1OC4xNSIgZm9udC13ZWlnaHQ9IjcwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNy43NyA1Mi4zOSkiPmg8L3RleHQ+PGNpcmNsZSBjeD0iNDkuOTEiIGN5PSI0NyIgcj0iNSIvPjwvZz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-size: 60%;
    background-color: black;
    background-position-x: center;
    background-position-y: 65%;
    position: fixed;
    bottom: 20px;
    left: -15px;
    box-shadow: -2px 2px 9px #202020;
    transition: width 0.5s, height 0.5s;
}

#fButton {
    cursor: pointer;
    width: 2em;
    height: 2em;
}

#myFloatingButton p {
    color: white;
    display: block;
    text-align: center;
    margin: 0px;
    font-family: 'Roboto';
    font-size: 18px;
}

#myFloatingButton:hover {
    width: 30px;
    height: 30px;
    left: 0;
}

`);
