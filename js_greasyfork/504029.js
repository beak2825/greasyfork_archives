// ==UserScript==
// @icon            https://www.teamcalapp.com/wp-content/uploads/2018/07/cropped-favicon-32x32.png
// @name            TeamCal Unlocked
// @version         1.2
// @description     Unlock TeamCal features
// @include         https://app.teamcalapp.com/*
// @namespace       https://app.teamcalapp.com
// @license         GNU GPLv3
// @author          R4wwd0G
// @downloadURL https://update.greasyfork.org/scripts/504029/TeamCal%20Unlocked.user.js
// @updateURL https://update.greasyfork.org/scripts/504029/TeamCal%20Unlocked.meta.js
// ==/UserScript==


function hideDiv() {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('trial-dialog')) {
                        node.style.display = 'none';
                        observer.disconnect();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

window.addEventListener('DOMContentLoaded', hideDiv);

window.onload = function() {
    setTimeout(function() {
        document.querySelector('[class="home-logo"]').style.display= "none";
        document.querySelectorAll('span').forEach(span => span.textContent.trim() === ':' && span.remove());
        document.querySelector('[ng-if="ctrl.isTrial || ctrl.isTrialExpired"]').style.display= "none";
        document.querySelectorAll('[disabled="disabled"]').forEach(function(element) {
            element.removeAttribute('disabled');
        });
    }, 3000);
};

setInterval(function() {
    document.querySelector('[aria-label="Refresh Schedule"]').click();
}, 60000);

function detectKeyboardInteraction() {
    window.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            clickButton('Next date');
        } else if (event.key === 'ArrowLeft') {
            clickButton('Previous date');
        }
    });
}

function clickButton(ariaLabel) {
    var button = document.querySelector(`button[aria-label="${ariaLabel}"]`);
    if (button) {
        button.click();
    } else {
        console.log(`Button with aria-label="${ariaLabel}" not found.`);
    }
}

detectKeyboardInteraction();

var colorTodo = '#b0b0b0',
		colorInProgress = 'rgb(255, 155, 0)',
    colorBlocked = 'rgb(255, 5, 0)',
    colorCancelled = '#616161',
    colorDone = '#0b8043';

function forceContextMenu(element) {
    var rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
    });
    element.dispatchEvent(rightClickEvent);
}

function createColorPalette(element, event) {
    var existingPalette = document.querySelector('.color-palette');
    if (existingPalette) {
        existingPalette.remove();
    }

    var palette = document.createElement('div');
    palette.className = 'color-palette';
    palette.style.position = 'absolute';
    palette.style.backgroundColor = '#fff';
    palette.style.border = '1px solid #ccc';
    palette.style.padding = '3px';
    palette.style.zIndex = '1000';
    palette.style.display = 'flex';
    palette.style.flexDirection = 'column';
    palette.style.gap = '0px';
    palette.style.borderRadius = '15px';
    palette.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    palette.style.opacity = '0';
    palette.style.transition = 'opacity 0.5s ease';

    var eventUID = element.closest('.k-event').getAttribute('data-uid');

    var colors = {
        [colorTodo]:        'A fazer',  
      	[colorInProgress]:  'Em progresso',
        [colorBlocked]:     'Bloqueado',
        [colorCancelled]:   'Cancelado',
        [colorDone]:        'Concluído'
    };

    var colorMapping = {
        [colorTodo]: '#616161',
      	[colorInProgress]: '#f4511e',
        [colorBlocked]: '#d50201',
        [colorCancelled]: '#616161',
        [colorDone]: '#0b8043'
    };

    for (var color in colors) {
        (function(color) {
            var item = document.createElement('div');
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.cursor = 'pointer';
            item.style.padding = '3px 6px';
            item.style.borderRadius = '4px';
            item.style.fontSize = '14px';

            var button = document.createElement('div');
            button.style.width = '18px';
            button.style.height = '18px';
            button.style.backgroundColor = color;
            button.style.borderRadius = '50%';
            button.style.marginRight = '10px';

            var label = document.createElement('span');
            label.innerText = colors[color];
            label.style.color = '#000';

            item.addEventListener('mouseenter', function() {
                item.style.backgroundColor = '#e0e0e0';
                item.style.borderRadius = '13px';
            });

            item.addEventListener('mouseleave', function() {
                item.style.backgroundColor = '';
                item.style.borderRadius = '13px';
            });

            item.addEventListener('click', function() {
                forceContextMenu(element);

                setTimeout(function() {
                    var appColor = colorMapping[color];
                    var colorButton = document.querySelector(`button[onclick*="colorChooser('${appColor}')"]`);

                    if (colorButton) {
                        colorButton.click();
                    } else {
                        console.log(`Button with color ${appColor} not found.`);
                    }

                    palette.style.opacity = '0';
                    setTimeout(function() {
                        palette.remove();
                    }, 300);
                }, 100);
            });

            item.appendChild(button);
            item.appendChild(label);
            palette.appendChild(item);
        })(color);
    }

    document.body.appendChild(palette);

    var rect = element.getBoundingClientRect();
    palette.style.left = event.clientX + 'px';
    palette.style.top = (rect.bottom + 1) + 'px';

    setTimeout(function() {
        palette.style.opacity = '1';
    }, 10);

    let hideTimeout;
    palette.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
    });

    palette.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(function() {
            palette.style.opacity = '0';
            setTimeout(function() {
                palette.remove();
            }, 300);
        }, 200);
    });

    element.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
    });

    element.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(function() {
            palette.style.opacity = '0';
            setTimeout(function() {
                palette.remove();
            }, 300);
        }, 200);
    });
}

function applyListeners() {
    var elements = document.querySelectorAll('.k-event-template');

    elements.forEach(function(element) {
        if (!element.getAttribute('data-listener-applied')) {
            let hoverTimeout;
            element.addEventListener('mouseenter', function(event) {
                hoverTimeout = setTimeout(function() {
                    createColorPalette(element, event);
                }, 500);
            });
            element.addEventListener('mouseleave', function() {
                clearTimeout(hoverTimeout);
            });
            element.setAttribute('data-listener-applied', 'true');
        }
    });
}

function checkAndBindListeners() {
    applyListeners();

    setInterval(function() {
        applyListeners();
    }, 1000);
}

checkAndBindListeners();

function replaceColors() {
    const originalColors = {
      	'#616161': [colorTodo],  
      	'#f4511e': [colorInProgress],
        '#d50201': [colorBlocked],
        '#0b8043': [colorDone]
    };

    document.querySelectorAll('.k-event-template').forEach((element) => {
        const bgColor = window.getComputedStyle(element).backgroundColor;

        for (let originalColor in originalColors) {
            const lightColor = originalColors[originalColor];
            if (bgColor === hexToRgb(originalColor)) {
                element.style.backgroundColor = lightColor;
            }
        }
    });
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
}

const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList.contains('k-event-template')) {
                    replaceColors();
                }
            });
        } else if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            replaceColors();
        }
    });
});

observer.observe(document.body, { attributes: true, childList: true, subtree: true });

replaceColors();
