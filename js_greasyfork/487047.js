// ==UserScript==
// @name         Catalog Hide
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Реализует скрытие тредов в каталоге
// @author       You
// @match        https://2ch.hk/*/catalog.html
// @match        https://2ch.life/*/catalog.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/487047/Catalog%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/487047/Catalog%20Hide.meta.js
// ==/UserScript==

// === ПОДГОТОВКА ===
const svg_hide = `<svg class="de-panel-svg" width="25" height="25" style="filter: drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black);position: absolute;top: 10px;left: 10px;">

<style>
    .de-panel-svg:hover .de-svg-stroke {
        stroke: red;
    }
</style><path class="de-svg-stroke" d="M6 19L19 6M6 6l13 13" style="stroke-width: 4px;"></path>

</svg>`

const css = '.de-panel-svg path{ stroke: white }';
const style = document.createElement("style");
style.innerText = css;
document.head.appendChild(style);

// КОНСТАНТЫ
const ATTR_THREAD_NUM = 'data-num';
const LS_HIDDEN_THREADS = 'de-threads';
const LS_HIDDEN_POSTS = 'de-posts';

class ThreadHelper {
    static _idPrefix = 'js-thread-';
    /**
    * @param {HTMLDivElement} thread
    * @returns {number}
    */
    static num(thread) {
        return parseInt(thread.getAttribute(ATTR_THREAD_NUM));
    }

    /**
    * @param {HTMLDivElement} thread
    * @returns {string}
    */
    static id(thread) {
        return this._idPrefix + this.num(thread);
    }

    /**
    * @param {HTMLDivElement} thread
    * @returns {boolean}
    */
    static exists(thread) {
        return document.getElementById(this.id(thread)).style.display != 'none';
    }

    /**
    * @param {HTMLDivElement} thread
    * @returns {string}
    */
    static title(thread) {
        return thread.lastElementChild.firstElementChild.lastElementChild.textContent;
    }

    /**
    * @param {HTMLDivElement} thread
    * @returns {SVGAElement}
    * @returns {null}
    */
    static findHideButton(thread) {
        return thread.firstElementChild.firstElementChild.querySelector("svg[class='de-panel-svg'")
    }

    /**
    * @param {HTMLDivElement} thread
    * @param {HidePolicy} policy
    */
    static hide(thread, policy) {
        const id = this.id(thread);
        const mainContentThread = document.getElementById(id);
        
        policy.hide(thread);
        policy.hide(mainContentThread);
    }
    /**
    * @param {HTMLDivElement} thread
    * @param {HidePolicy} policy
    */
    static unhide(thread, policy) {
        const id = this.id(thread);
        const mainContentThread = document.getElementById(id);
        policy.unhide(thread)
        policy.unhide(mainContentThread);
    }
}

class HidePolicy {
    /**
    * @param {HTMLDivElement} thread
    */
    isHidden(thread) { throw new Element('Not Implemented'); }
    hide(thread) { throw new Element('Not Implemented'); }
    unhide(thread) { throw new Element('Not Implemented'); }
}

class DisplayNonePolicy extends HidePolicy {
    /**
    * @param {HTMLDivElement} thread
    */
    isHidden(thread) {
        return thread.style.display === 'none';
    }

    /**
    * @param {HTMLDivElement} thread
    */
    hide(thread) {
        thread.style.opacity = 1;
        thread.style.display = 'none';
    }
    unhide(thread) {
        thread.style.display = '';
    }
}

class DisplayOpacityPolicy extends HidePolicy {
    /**
    * @param {HTMLDivElement} thread
    */
    isHidden(thread) {
        return thread.style.opacity === 0.1;
    }

    /**
    * @param {HTMLDivElement} thread
    */
    hide(thread) {
        thread.style.display = '';
        thread.style.opacity = 0.1;
    }
    unhide(thread) {
        thread.style.opacity = 1;
    }
}

// Взаимодействия с хранилищем скрытых тредов
class HiddenRepository {
    constructor(board) {
        this._board = board;
        this._storage = window.localStorage;
        this._threads = this.refreshThreads();
        this._posts = this.refreshPosts();
    }

    /**
    * @returns {Object}
    */
    refreshThreads() {
        return JSON.parse(
            this._storage.getItem(LS_HIDDEN_THREADS)
        );
    }

    /**
    * @returns {Object}
    */
    refreshPosts() {
        return JSON.parse(
            this._storage.getItem(LS_HIDDEN_POSTS)
        );
    }

    /**
    * @returns {Object}
    */
    get() {
        return this._threads;
    }

    /**
    * @param {HTMLDivElement} thread
    */
    add(thread) {
        const num = ThreadHelper.num(thread);
        const timestamp = Date.now();
        const title = ThreadHelper.title(thread);
        this._threads[this._board][num] = [timestamp, num, title];
        this._posts[this._board][num] = [timestamp, num, true];
    }

    /**
    * @param {HTMLDivElement} thread
    */
    remove(thread) {
        const num = ThreadHelper.num(thread);
        delete this._threads[this._board][num];
        delete this._posts[this._board][num];
    }

    commit() {
        this._storage.setItem(
            LS_HIDDEN_THREADS,
            JSON.stringify(this._threads)
        );
        this._storage.setItem(
            LS_HIDDEN_POSTS,
            JSON.stringify(this._posts)
        );
    }

    /**
    * @param {HTMLDivElement} thread
    * @returns {boolean}
    */
    isHidden(thread) {
        const num = ThreadHelper.num(thread);
        return num in this._threads[this._board] || (num in this._posts[this._board] && this._posts[this._board][num][2]);
    }
}

// ВЫЧИСЛЯЕМЫЕ
const board = window.location.pathname.split('/')[1];
const hidden = new HiddenRepository(board);
let hidePolicy = new DisplayNonePolicy();


// === ОБСЁРВЕР ДЛЯ ДОБАВЛЕНИЯ КНОПОК СКРЫТИЯ ===
/** Слушает каталог на предмет изменения тредов
* @param {Array<MutationRecord>} mutationList
*/
function threadListener(mutationList, observer) {
    mutationList.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            resolveThread(node);
        })
    });
}

/** Добавляет тредам новую логику
* @param {HTMLDivElement} thread
*/
function resolveThread(thread) {
    safeCreateHideButton(thread);
    removeHiddenThread(thread);
}

/** Добавляет кнопку скрытия для треда
* @param {HTMLDivElement} thread
* @returns {SVGAElement}
*/
function addHideSvg(thread) {
    const a = thread.firstElementChild.firstElementChild;
    a.insertAdjacentHTML("beforeend", svg_hide);
    return ThreadHelper.findHideButton(thread);
}

/** Создаёт кнопку скрытия действия если она уже не была создана
* @param {HTMLDivElement} thread
* @returns {SVGAElement}
*/
function safeCreateHideButton(thread) {
    const callback = (event) => onHideClick(event, thread);

    const button = ThreadHelper.findHideButton(thread);
    if (button != null) {
        if (button.onclick === null) {
            button.onclick = callback;
        }
        return;
    }
    const hideBtn = addHideSvg(thread);
    hideBtn.onclick = callback;
    return hideBtn;
}

/** Скрывает тред в DOM если он является скрытым
* @param {HTMLDivElement} thread
* @param {boolean} факт удаления треда
*/
function removeHiddenThread(thread) {
    const isHidden = hidden.isHidden(thread);
    if (isHidden) {
        ThreadHelper.hide(thread, hidePolicy);
    }
    return isHidden;
}

/** Логика скрытия при нажатии по соответствующей кнопке
* @param {Event} event
* @param {HTMLDivElement} thread
*/
function onHideClick(event, thread) {
    event.preventDefault();
    if (hidden.isHidden(thread)) {
        ThreadHelper.unhide(thread, hidePolicy);
        hidden.remove(thread);
    } else {
        ThreadHelper.hide(thread, hidePolicy);
        hidden.add(thread);
    }
    hidden.commit();
}

function applyChildlistObserver(target, callback) {
    const observer = new MutationObserver(threadListener);
    observer.observe(target, { "childList": true })
}

function applyHidePolicyToAllThreads() {
    // Прохожу разово по всем малышам для применения к ним логики скрипта
    [...document.getElementById("js-threads").children].forEach(thread => resolveThread(thread));
}

function main() {
    applyHidePolicyToAllThreads();
    const target = document.getElementsByTagName("main")[0];
    applyChildlistObserver(target, threadListener)
}

// == UI ==
// инстациируем
const header = document.querySelector("div[class='header__meta']");
const label = document.createElement('label');
label.className = 'header__ctlgnav';
const span = document.createElement('span');
span.innerText = 'Прозрачное скрытие ';
const checkbox = document.createElement('input');
checkbox.id = 'opacity-hide-policy';
checkbox.type = 'checkbox';
// отображаем
label.appendChild(span);
label.appendChild(checkbox);
header.appendChild(label);
// логика скрытия для чекбокса
checkbox.onclick = () => {
    const checkbox = document.getElementById('opacity-hide-policy');
    if (checkbox.checked) {
      hidePolicy = new DisplayOpacityPolicy();
    } else {
      hidePolicy = new DisplayNonePolicy();
    }
    applyHidePolicyToAllThreads();
}

(function () {
    'use strict';
    window.addEventListener("load", function () {
        main();
    }, false);
})();