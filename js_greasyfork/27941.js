// ==UserScript==
// @name        Portraitify - Kinguin
// @namespace   lazi3b0y
// @description Kinguin fixes
// @include     *www.kinguin.net*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27941/Portraitify%20-%20Kinguin.user.js
// @updateURL https://update.greasyfork.org/scripts/27941/Portraitify%20-%20Kinguin.meta.js
// ==/UserScript==

var target = document.getElementsByTagName('body')[0];

console.log('Kinguin script: Creating observer.');
var observer = new MutationObserver(function () {
    console.log('Kinguin script: Mutation observed.');
    removeBanners();
    removeClutter();
    portraitify();
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

removeBanners();
removeClutter();
portraitify();

console.log('Kinguin script: Binding element to observer to watch for changes.');
observer.observe(target, config);

window.onresize = function () {
    removeBanners();
    removeClutter();
    portraitify();
}

function removeBanners() {
    var elements = document.getElementsByClassName('top-banner-close');
    for (i = 0; i < elements.length; i++) {
        elements[i].click();
    }

    elements = document.getElementsByClassName('remove');
    for (i = 0; i < elements.length; i++) {
        elements[i].click();
    }
    observer.disconnect();
}

function removeClutter() {
    var elements = document.getElementsByClassName('sidebar');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }

    var elements = document.getElementsByClassName('fdbk-section');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }

    var elements = document.getElementsByClassName('blog-home');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}

function portraitify() {
    var element;
    var elements;
    if (window.outerWidth < window.outerHeight) {
        elements = document.getElementsByClassName('main');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '90vw';
        }

        elements = document.getElementsByClassName('col-main');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.float = 'none';
            elements[i].style.width = '100%';
        }

        elements = document.getElementsByClassName('product-tabs-content');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
        }

        elements = document.getElementsByClassName('main-products-wrapper');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
        }

        elements = document.getElementsByClassName('main-products-div');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
            elements[i].style.float = 'none';
        }

        elements = document.getElementsByClassName('main-product-tabs');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '99.8%';
        }

        elements = document.getElementsByClassName('main-products-wrapper-pagination');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '99.8%';
        }

        elements = document.getElementsByClassName('header');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
        }

        elements = document.getElementsByClassName('header_middle');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
            elements[i].style.paddingLeft = '0';
        }

        element = document.getElementById('banner');
        if (element !== undefined && element !== null) {
            element.style.width = '100%';
        }

        element = document.getElementById('dg-container');
        if (element !== undefined && element !== null) {
            element.style.width = '100%';
            element.style.marginLeft = '0';
            element.style.marginTop = '0';
        }

        elements = document.getElementsByClassName('top-banner');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.overflow = 'hidden';
        }

        elements = document.getElementsByClassName('bottom-banner');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
            elements[i].style.marginLeft = '0';
        }

        elements = document.getElementsByClassName('carousel-buttons');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
        }

        elements = document.getElementsByClassName('leftbutton1');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.left = '10px';
        }

        elements = document.getElementsByClassName('rightbutton1');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.right = '17px';
        }

        elements = document.getElementsByClassName('carousel-countainer1');
        for (i = 0; i < elements.length; i++) {
            elements[i].style.width = '100%';
        }

        element = document.getElementById('bottomBanner');
        if (element !== undefined && element !== null) {
            element.style.width = '100%';
        }
    } else {
        landscapify();
    }
}

function landscapify() {
    var element;
    var elements;

    /*
     * Revert portrait modifications
     */

    elements = document.getElementsByClassName('main');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('main-products-wrapper-pagination');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('header');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('header_middle');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    element = document.getElementById('banner');
    if (element !== undefined && element !== null) {
        element.removeAttribute('style');
    }

    elements = document.getElementsByClassName('top-banner');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    element = document.getElementById('dg-container');
    if (element !== undefined && element !== null) {
        element.removeAttribute('style');
    }

    elements = document.getElementsByClassName('bottom-banner');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('carousel-buttons');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('leftbutton1');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('rightbutton1');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    elements = document.getElementsByClassName('carousel-countainer1');
    for (i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('style');
    }

    element = document.getElementById('bottomBanner');
    if (element !== undefined && element !== null) {
        element.removeAttribute('style');
    }

    /*
     * Modify elements
     */

    elements = document.getElementsByClassName('col-main');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.float = 'none';
        elements[i].style.width = '100%';
    }

    elements = document.getElementsByClassName('product-tabs-content');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = '100%';
    }

    elements = document.getElementsByClassName('main-products-wrapper');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = '100%';
    }

    elements = document.getElementsByClassName('main-products-div');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = '100%';
        elements[i].style.float = 'none';
    }

    elements = document.getElementsByClassName('main-product-tabs');
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = '99.8%';
    }
}