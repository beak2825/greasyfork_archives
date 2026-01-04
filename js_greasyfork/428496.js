// ==UserScript==
// @name         MH - Disarm Cheese/Charm Buttons
// @description  Cheese/Charm disarm buttons
// @author       Chromatical
// @version      1.0.1
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428496/MH%20-%20Disarm%20CheeseCharm%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/428496/MH%20-%20Disarm%20CheeseCharm%20Buttons.meta.js
// ==/UserScript==

$(document).ready(function(){
    if($(".campPage-trap-armedItemContainer")[0]){
       typeof $("#chro-disarm-box")[0] == "object"? null : disarm()
    }
})

$(document).ajaxComplete(function(){
    if($(".campPage-trap-armedItemContainer")[0]){
       typeof $("#chro-disarm-box")[0] == "object"? null : disarm()
    }
})

function disarm(){
    const createElement = (tagName, config = {}) => {
    const el = document.createElement(tagName);
    if (config.attrs) Object.entries(config.attrs).forEach(([attr, val]) => el.setAttribute(attr, val));
    if (config.props) Object.entries(config.props).forEach(([prop, val]) => el[prop] = val);
    if (config.css) Object.entries(config.css).forEach(([prop, val]) => el.style[prop] = val);
    if (config.children) config.children.forEach(child => el.append(child));
        return el;
    };

    var cheeseImg = $(".campPage-trap-armedItem-image")[0].style.backgroundImage
    var charmImg = $(".campPage-trap-armedItem-image")[3].style.backgroundImage

    function createDiv(){
        const chartMain = $(".campPage-trap-armedItem.trinket")[0].insertAdjacentElement('afterend',(createElement('div', {
            attrs: {
                id: 'chro-disarm-box'
            },
            children: [
                createElement('button', {
                    attrs: {
                        id: 'chro-disarm-bait-btn',
                        onclick: 'hg.utils.TrapControl.disarmBait().go()',
                        title: 'Disarm Bait'
                    },
                    css: {
                        position: 'absolute',
                        width: '30px',
                        height: '30px',
                        right: '0px',
                        top: '0px',
                    },
                    children: [
                        createElement('div',{
                            css: {
                                position: 'absolute',
                                'border': '1px solid #ece3da',
                                width: '23px',
                                height: '23px',
                                top: '0.5px',
                                left: '1px',
                                'background-image': cheeseImg,
                                'background-size': 'contain',
                                 filter: 'grayscale(100%)',
                            }
                        })]
                }),
                 createElement('button', {
                    attrs: {
                        id: 'chro-disarm-charm-btn',
                        onclick: 'hg.utils.TrapControl.disarmTrinket().go()',
                        title: 'Disarm Charm'
                    },
                    css: {
                        position: 'absolute',
                        width: '30px',
                        height: '30px',
                        right: '0px',
                        top: '35px'
                    },
                    children: [
                        createElement('div',{
                            css: {
                                position: 'absolute',
                                'border': '1px solid #ece3da',
                                width: '23px',
                                height: '23px',
                                top: '0.5px',
                                left: '1px',
                                'background-image': charmImg,
                                'background-size': 'contain',
                                 filter: 'grayscale(100%)',
                            }
                        })]
                 })
            ]
        }))
    )}
    createDiv()
}